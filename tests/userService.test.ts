import { SUBSCRIPTION_STATUS } from '../constant/const';
import { User } from '../models/User';
import { IRepository } from '../repositories/IRepository';
import { UserService } from '../services/userService';

// Mock UserRepository
const mockUserRepository: jest.Mocked<IRepository<User>> = {
  getAll: jest.fn(),
  getAllByConditions: jest.fn(),
  getSingleById: jest.fn(),
  getSingleByConditions: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  getPageData: jest.fn(),
  countByConditions: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    // Create an instance of UserService with the mocked UserRepository
    userService = new UserService(mockUserRepository);
  });

  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {

    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          customerId: 'test-customer-1',
          username: 'test-username-1',
          createdBy: "test | test@example.com",
          createdDate: new Date(2024, 8, 14),
          subscriptionId: "test",
          subscriptionEndDate: new Date(2024, 9, 14),
          isOnboarded: false,
          role: "User",
          subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          customerId: 'test-customer-2',
          username: 'test-username-2',
          createdBy: "test | test@example.com",
          createdDate: new Date(2024, 8, 14),
          subscriptionId: "tes2",
          subscriptionEndDate: new Date(2024, 9, 14),
          isOnboarded: false,
          role: "User",
          subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE
        },
      ];

      // Mock the findAll method to return the mockUsers array
      mockUserRepository.getAll.mockResolvedValue(mockUsers);

      const result = await userService.getAll();

      // Assertions
      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const newUser: User = {
        id: '3',
        firstName: 'Jack',
        lastName: 'Doe',
        customerId: 'test-customer-3',
        username: 'test-username-3',
        email: 'jack@example.com',
        createdBy: "test | test@example.com",
        createdDate: new Date(2024, 8, 14),
        subscriptionId: "test3",
        subscriptionEndDate: new Date(),
        isOnboarded: false,
        role: "User",
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE
      };

      // Mock the create method to return the newUser
      mockUserRepository.create.mockResolvedValue(newUser);
      // TODO: need to mock Stripe Customer

      //const result = await userService.createUser(newUser.firstName, newUser.lastName, newUser.email);

      // Assertions
      //expect(result).toEqual(newUser);
      //expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});