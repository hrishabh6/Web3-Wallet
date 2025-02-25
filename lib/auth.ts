// In a new file: lib/auth.ts

// Simple auth system (in a real app, use proper authentication)
export const createAccount = (email: string, password: string): boolean => {
    try {
      // Check if account already exists
      const accounts = JSON.parse(localStorage.getItem('authAccounts') || '{}');
      
      if (accounts[email]) {
        return false; // Account already exists
      }
      
      // In a real app, hash the password securely
      accounts[email] = { password, createdAt: new Date().toISOString() };
      localStorage.setItem('authAccounts', JSON.stringify(accounts));
      
      // Set current user
      localStorage.setItem('currentUser', email);
      
      return true;
    } catch (error) {
      console.error("Error creating account:", error);
      return false;
    }
  };
  
  export const login = (email: string, password: string): boolean => {
    try {
      const accounts = JSON.parse(localStorage.getItem('authAccounts') || '{}');
      
      if (!accounts[email] || accounts[email].password !== password) {
        return false; // Invalid credentials
      }
      
      // Set current user
      localStorage.setItem('currentUser', email);
      
      return true;
    } catch (error) {
      console.error("Error logging in:", error);
      return false;
    }
  };
  
  export const logout = (): void => {
    localStorage.removeItem('currentUser');
  };
  
  export const getCurrentUser = (): string | null => {
    return localStorage.getItem('currentUser');
  };
  
  export const isLoggedIn = (): boolean => {
    return getCurrentUser() !== null;
  };