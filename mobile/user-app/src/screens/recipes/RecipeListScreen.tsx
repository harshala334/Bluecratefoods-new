import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';
import { spacing, borderRadius, shadow } from '../../constants/spacing';
import RecipeCard from '../../components/recipe/RecipeCard';
import { Feather } from '@expo/vector-icons';
import { Recipe } from '../../types/recipe';
import { recipeService } from '../../services/recipeService';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../../stores/authStore';

export const RecipeListScreen = ({ route, navigation }: any) => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  // ... (rest of the state)
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Get filter from navigation params (when coming from Home screen)
  useEffect(() => {
    if (route.params?.timeFilter) {
      // Map string filters from Home to numbers
      const filterMap: Record<string, number> = {
        '1min': 1,
        '10min': 10,
        '1hour': 60,
      };
      setSelectedTime(filterMap[route.params.timeFilter] || null);
    }

    if (route.params?.initialSearch) {
      setSearchTerm(route.params.initialSearch);
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      loadRecipes();
    }, [])
  );

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipes();
      // Fallback to mock if API returns empty array (e.g. empty DB) or fails
      if (!data?.recipes || data.recipes.length === 0) throw new Error('No recipes found');
      setRecipes(data.recipes);
    } catch (error) {
      console.error('Failed to load recipes', error);
      // TODO: Remove this mock fallback after backend endpoint is fixed
      // Hardcoded fallback logic
      const mockRecipes = require('../../data/recipes').recipes;
      console.log('Using mock recipes fallback');
      setRecipes(mockRecipes);
    } finally {
      setLoading(false);
    }
  };

  const timeFilters = [
    { id: 'all', label: 'All', value: null },
    { id: '1min', label: '< 1 min', value: 1 },
    { id: '10min', label: '< 10 min', value: 10 },
    { id: '1hour', label: '< 1 hour', value: 60 },
  ];

  const difficultyFilters = ['All', 'Easy', 'Medium', 'Hard'];

  const parseTime = (timeStr: string): number => {
    const match = timeStr.match(/(\d+)/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Filter recipes
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesTime = true;
    if (selectedTime !== null) {
      const recipeMinutes = parseTime(recipe.time);
      if (selectedTime === 60) {
        // For 1 hour filter, show recipes between 10 and 60 minutes
        matchesTime = recipeMinutes <= 60 && recipeMinutes > 10;
      } else {
        matchesTime = recipeMinutes <= selectedTime;
      }
    }

    const matchesDifficulty = !selectedDifficulty || selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
    return matchesSearch && matchesTime && matchesDifficulty;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTime(null);
    setSelectedDifficulty(null);
  };

  const handleRecipePress = (recipeId: number) => {
    navigation.navigate('RecipeDetail', { recipeId });
  };

  return (
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs }}>
          <Text style={styles.headerTitle}>Pick today's meal</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Choose a dish, select ingredients, and start cooking
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color={colors.gray[500]} style={{ marginRight: spacing.sm }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for recipes..."
            placeholderTextColor={colors.gray[400]}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Feather name="x" size={16} color={colors.gray[400]} style={{ paddingHorizontal: spacing.sm }} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filtersRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.xs }}>
              <Feather name="clock" size={14} color={colors.gray[700]} style={{ marginRight: 4 }} />
              <Text style={styles.filterLabel}>Time:</Text>
            </View>
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterButton,
                  selectedTime === filter.value && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedTime(filter.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedTime === filter.value && styles.filterButtonTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.difficultyScroll}>
          <View style={styles.filtersRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: spacing.xs }}>
              <Feather name="bar-chart-2" size={14} color={colors.gray[700]} style={{ marginRight: 4 }} />
              <Text style={styles.filterLabel}>Level:</Text>
            </View>
            {difficultyFilters.map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  ((difficulty === 'All' && !selectedDifficulty) || selectedDifficulty === difficulty) &&
                  styles.filterButtonActive,
                ]}
                onPress={() => setSelectedDifficulty(difficulty === 'All' ? null : difficulty)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    ((difficulty === 'All' && !selectedDifficulty) || selectedDifficulty === difficulty) &&
                    styles.filterButtonTextActive,
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          Showing <Text style={styles.resultsBold}>{filteredRecipes.length}</Text> recipes
        </Text>
        {(searchTerm || selectedTime || selectedDifficulty) && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear All</Text>
          </TouchableOpacity>
        )}
        {user?.isVerifiedCreator && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddRecipe')}
          >
            <Feather name="plus" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add New</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Recipe List */}
      {loading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => <RecipeCard recipe={item} onPress={handleRecipePress} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="search" size={60} color={colors.gray[300]} style={{ marginBottom: spacing.lg }} />
          <Text style={styles.emptyTitle}>No recipes found</Text>
          <Text style={styles.emptyText}>Try adjusting your filters or search term</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.display,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.gray[600],
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  addButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs, // Reduced vertical padding
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  searchIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm, // Reduced font size
    color: colors.text.primary,
    paddingVertical: spacing.xs, // Reduced vertical padding
  },
  clearIcon: {
    fontSize: 16,
    color: colors.gray[400],
    paddingHorizontal: spacing.sm,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    paddingVertical: spacing.sm, // Reduced vertical padding
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md, // Reduced horizontal padding
    gap: spacing.xs,
  },
  difficultyScroll: {
    marginTop: spacing.xs, // Reduced margin
  },
  filterLabel: {
    fontSize: typography.fontSize.xs, // Reduced font size
    fontFamily: typography.fontFamily.semibold,
    color: colors.gray[700],
    marginRight: spacing.xs,
  },
  filterButton: {
    paddingHorizontal: spacing.sm, // Reduced padding
    paddingVertical: spacing.xs, // Reduced padding
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
  },
  filterButtonActive: {
    backgroundColor: colors.primary[500],
  },
  filterButtonText: {
    fontSize: typography.fontSize.xs, // Reduced font size
    fontFamily: typography.fontFamily.medium,
    color: colors.gray[700],
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md, // Reduced padding
    paddingBottom: spacing.xs,
  },
  resultsText: {
    fontSize: typography.fontSize.sm, // Reduced font size
    color: colors.gray[600],
  },
  resultsBold: {
    fontFamily: typography.fontFamily.semibold,
    color: colors.text.primary,
  },
  clearFiltersText: {
    fontSize: typography.fontSize.xs, // Reduced font size
    fontFamily: typography.fontFamily.semibold,
    color: colors.primary[600],
  },
  listContent: {
    padding: spacing.md,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.fontSize['2xl'],
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  clearButton: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
  },
  clearButtonText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700' as const,
    color: colors.white,
  },
});

export default RecipeListScreen;
