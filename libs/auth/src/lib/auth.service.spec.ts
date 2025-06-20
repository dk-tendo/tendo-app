import { AuthService } from './auth.service';
import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';
import type { SignUpOutput, SignInOutput } from 'aws-amplify/auth';

jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
}));

const mockSignIn = signIn as jest.MockedFunction<typeof signIn>;
const mockSignUp = signUp as jest.MockedFunction<typeof signUp>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<
  typeof getCurrentUser
>;

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('should successfully sign up a user', async () => {
      const email = 'test@example.com';
      const password = 'TestPassword123!';
      const mockSignUpOutput: SignUpOutput = {
        isSignUpComplete: false,
        nextStep: {
          signUpStep: 'CONFIRM_SIGN_UP',
          codeDeliveryDetails: {
            deliveryMedium: 'EMAIL',
            destination: email,
          },
        },
        userId: '123',
      };

      mockSignUp.mockResolvedValue(mockSignUpOutput);

      const result = await authService.signUp(email, password);

      expect(mockSignUp).toHaveBeenCalledWith({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      expect(result).toEqual({
        success: true,
        user: mockSignUpOutput,
      });
    });

    it('should handle sign up errors', async () => {
      const email = 'test@example.com';
      const password = 'TestPassword123!';
      const mockError = new Error('User already exists');

      mockSignUp.mockRejectedValue(mockError);

      const result = await authService.signUp(email, password);

      expect(mockSignUp).toHaveBeenCalledWith({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      expect(result).toEqual({
        success: false,
        error: mockError,
      });
    });

    it('should handle invalid email format', async () => {
      const email = 'invalid-email';
      const password = 'TestPassword123!';
      const mockError = new Error('Invalid email format');

      mockSignUp.mockRejectedValue(mockError);

      const result = await authService.signUp(email, password);

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const email = 'test@example.com';
      const password = 'TestPassword123!';
      const mockSignInOutput: SignInOutput = {
        isSignedIn: true,
        nextStep: {
          signInStep: 'DONE',
        },
      };

      mockSignIn.mockResolvedValue(mockSignInOutput);

      const result = await authService.signIn(email, password);

      expect(mockSignIn).toHaveBeenCalledWith({
        username: email,
        password,
      });
      expect(result).toEqual({
        success: true,
        user: mockSignInOutput,
      });
    });

    it('should handle sign in errors', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const mockError = new Error('Incorrect username or password');

      mockSignIn.mockRejectedValue(mockError);

      const result = await authService.signIn(email, password);

      expect(mockSignIn).toHaveBeenCalledWith({
        username: email,
        password,
      });
      expect(result).toEqual({
        success: false,
        error: mockError,
      });
    });

    it('should handle user not confirmed error', async () => {
      const email = 'test@example.com';
      const password = 'TestPassword123!';
      const mockError = new Error('User is not confirmed');

      mockSignIn.mockRejectedValue(mockError);

      const result = await authService.signIn(email, password);

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });

  describe('signOut', () => {
    it('should successfully sign out a user', async () => {
      mockSignOut.mockResolvedValue(undefined);

      const result = await authService.signOut();

      expect(mockSignOut).toHaveBeenCalledWith();
      expect(result).toEqual({
        success: true,
      });
    });

    it('should handle sign out errors', async () => {
      const mockError = new Error('Sign out failed');

      mockSignOut.mockRejectedValue(mockError);

      const result = await authService.signOut();

      expect(mockSignOut).toHaveBeenCalledWith();
      expect(result).toEqual({
        success: false,
        error: mockError,
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      const mockUser = {
        userId: '123',
        username: 'test@example.com',
        attributes: {
          email: 'test@example.com',
          given_name: 'John',
          family_name: 'Doe',
        },
      };

      mockGetCurrentUser.mockResolvedValue(mockUser);

      const result = await authService.getCurrentUser();

      expect(mockGetCurrentUser).toHaveBeenCalledWith();
      expect(result).toEqual({
        success: true,
        user: mockUser,
      });
    });

    it('should handle no authenticated user', async () => {
      const mockError = new Error('No current user');

      mockGetCurrentUser.mockRejectedValue(mockError);

      const result = await authService.getCurrentUser();

      expect(mockGetCurrentUser).toHaveBeenCalledWith();
      expect(result).toEqual({
        success: false,
        error: mockError,
      });
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Network error');

      mockGetCurrentUser.mockRejectedValue(mockError);

      const result = await authService.getCurrentUser();

      expect(result.success).toBe(false);
      expect(result.error).toBe(mockError);
    });
  });
});
