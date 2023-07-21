import jwtDecode from 'jwt-decode';

class JwtHelper {
    static decodeToken(token) {
        try {
            return jwtDecode(token);
        } catch (error) {
            console.log('Error decoding token:', error);
            return null;
        }
    }
}

export default JwtHelper;
