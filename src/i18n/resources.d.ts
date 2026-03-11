interface Resources {
    common: {
        dark: 'Dark';
        email: 'Email address';
        errors: {
            internalError: 'An internal error happened. Please try again later by refreshing the page, and if the problem still persist contact us.';
            invalidData: 'Invalid data';
        };
        light: 'Light';
        logout: 'Logout';
        menu: {
            analytics: 'Analytics';
            home: 'Home';
            settings: 'Settings';
        };
        notFoundPage: {
            content: 'This page does not exist';
            title: '404';
        };
        pages: {
            analytics: {
                title: 'Analytics';
            };
            index: {
                title: 'Home';
            };
            login: {
                title: 'Login';
            };
            settings: {
                title: 'Settings';
            };
        };
        password: 'Password';
        selectLanguage: 'Select language';
        welcome: 'Welcome {{name}}';
    };
    guest: {
        login: {
            demoAccount: 'Login with Demo Account';
            emailValidation: {
                email: 'Use a valid email address';
                required: 'Use a valid email address';
            };
            invalidCredentials: 'Your email or password is wrong';
            passwordValidation: {
                matches: 'Password must be at least 6 characters long';
            };
            signIn: 'Sign In';
            signInToAccount: 'Sign in to your account';
        };
    };
    header: {
        theme: 'Switch Theme';
    };
}

export default Resources;
