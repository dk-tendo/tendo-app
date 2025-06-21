import { signIn, signUp, signOut, getCurrentUser } from 'aws-amplify/auth';

export class AuthService {
  async signUp(email: string, password: string) {
    try {
      const user = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async signIn(email: string, password: string) {
    try {
      const user = await signIn({
        username: email,
        password,
      });
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }

  async signOut() {
    try {
      await signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  }
}
