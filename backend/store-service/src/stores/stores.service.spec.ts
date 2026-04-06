import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoresService } from './stores.service';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';

describe('StoresService', () => {
  let service: StoresService;
  let repository: Repository<Store>;

  const mockStoreRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((store) =>
      Promise.resolve({ id: '1', ...store }),
    ),
    findOne: jest.fn().mockImplementation((query) =>
      Promise.resolve({ id: query.where.id, name: 'Test Store' }),
    ),
    find: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Store' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepository,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    repository = module.get<Repository<Store>>(getRepositoryToken(Store));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a store', async () => {
      const dto = { name: 'New Store' } as any;
      const result = await service.create(dto);
      expect(result).toEqual({ id: '1', name: 'New Store' });
      expect(mockStoreRepository.create).toHaveBeenCalledWith(dto);
      expect(mockStoreRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of stores', async () => {
      const result = await service.findAll();
      expect(result).toEqual([{ id: '1', name: 'Test Store' }]);
      expect(mockStoreRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single store', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1', name: 'Test Store' });
      expect(mockStoreRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
