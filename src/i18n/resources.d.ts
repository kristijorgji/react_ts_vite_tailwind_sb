interface Resources {
    common: {
        welcome: 'Welcome {{name}}';
        light: 'Light';
        dark: 'Dark';
        pages: {
            login: {
                title: 'Login';
            };
            index: {
                title: 'Home';
            };
            analytics: {
                title: 'Analytics';
            };
            settings: {
                title: 'Settings';
            };
        };
        menu: {
            home: 'Home';
            analytics: 'Analytics';
            settings: 'Settings';
        };
        notFoundPage: {
            title: '404';
            content: 'This page does not exist';
        };
        errors: {
            internalError: 'An internal error happened. Please try again later by refreshing the page, and if the problem still persist contact us.';
            invalidData: 'Invalid data';
        };
        email: 'Email address';
        password: 'Password';
        logout: 'Logout';
    };
    guest: {
        login: {
            signInToAccount: 'Sign in to your account';
            signIn: 'Sign In';
            invalidCredentials: 'Your email or password is wrong';
            emailValidation: {
                required: 'Use a valid email address';
                email: 'Use a valid email address';
            };
            passwordValidation: {
                matches: 'Password must be at least 6 characters long';
            };
        };
    };
    header: {
        theme: 'Switch Theme';
    };
}

export default Resources;
