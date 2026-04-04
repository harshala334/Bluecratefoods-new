import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
    body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
    #root { display: flex; flex: 1; height: 100%; overflow: hidden; }
    
    /* Enable horizontal scrolling for desktop and mobile PWA users */
    div[style*="overflow-x: auto"], div[style*="overflow-x: scroll"] {
      scrollbar-width: thin !important;
      scrollbar-color: #14b8a6 rgba(0,0,0,0.05) !important;
      -webkit-overflow-scrolling: touch !important;
      touch-action: pan-x !important;
    }
    
    /* Ensure children don't block the horizontal swipe */
    div[style*="overflow-x: auto"] > div,
    div[style*="overflow-x: scroll"] > div {
      touch-action: pan-x !important;
    }
    
    /* Ensure the vertical scroll doesn't eat the horizontal swipe */
    #root, body, html {
      touch-action: pan-y pinch-zoom;
    }

    /* Force inputs to be selectable/typable across all browsers */
    input, textarea, [contenteditable] {
      user-select: text !important;
      -webkit-user-select: text !important;
      cursor: text !important;
    }
    div[style*="overflow-x: auto"]::-webkit-scrollbar {
      height: 6px !important;
      display: block !important;
    }
    div[style*="overflow-x: auto"]::-webkit-scrollbar-track {
      background: rgba(0,0,0,0.05) !important;
      border-radius: 10px !important;
    }
    div[style*="overflow-x: auto"]::-webkit-scrollbar-thumb {
      background-color: #14b8a6 !important;
      border-radius: 10px !important;
    }
  `));
  document.head.appendChild(style);
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
