<?php
/**
 * Plugin Name: JWT Authentication for WP REST API
 * Description: JWT Authentication for WordPress REST API
 * Version: 1.0
 * Author: Vanalexcars
 */

if (!defined('ABSPATH')) {
    exit;
}

// Configuration JWT
define('JWT_AUTH_SECRET_KEY', 'your-secret-key-here');
define('JWT_AUTH_CORS_ENABLE', true);

// Ajouter les endpoints JWT
add_action('rest_api_init', 'jwt_auth_init');

function jwt_auth_init() {
    // Endpoint pour obtenir un token
    register_rest_route('jwt-auth/v1', '/token', array(
        'methods' => 'POST',
        'callback' => 'jwt_auth_generate_token',
        'permission_callback' => '__return_true',
    ));

    // Endpoint pour valider un token
    register_rest_route('jwt-auth/v1', '/token/validate', array(
        'methods' => 'POST',
        'callback' => 'jwt_auth_validate_token',
        'permission_callback' => '__return_true',
    ));

    // Endpoint pour rafraîchir un token
    register_rest_route('jwt-auth/v1', '/token/refresh', array(
        'methods' => 'POST',
        'callback' => 'jwt_auth_refresh_token',
        'permission_callback' => '__return_true',
    ));
}

// Générer un token JWT
function jwt_auth_generate_token($request) {
    $username = $request->get_param('username');
    $password = $request->get_param('password');

    if (empty($username) || empty($password)) {
        return new WP_Error('jwt_auth_invalid_credentials', 'Username and password are required.', array('status' => 400));
    }

    // Vérifier les identifiants
    $user = wp_authenticate($username, $password);
    if (is_wp_error($user)) {
        return new WP_Error('jwt_auth_invalid_credentials', 'Invalid username or password.', array('status' => 401));
    }

    // Générer le token JWT
    $token = jwt_auth_create_token($user);
    
    return array(
        'success' => true,
        'data' => array(
            'token' => $token,
            'user_email' => $user->user_email,
            'user_nicename' => $user->user_nicename,
            'user_display_name' => $user->display_name,
        )
    );
}

// Valider un token JWT
function jwt_auth_validate_token($request) {
    $token = $request->get_param('token');
    
    if (empty($token)) {
        return new WP_Error('jwt_auth_no_token', 'Token is required.', array('status' => 400));
    }

    $user = jwt_auth_verify_token($token);
    if (is_wp_error($user)) {
        return $user;
    }

    return array(
        'success' => true,
        'data' => array(
            'code' => 'jwt_auth_valid_token',
            'message' => 'Token is valid',
            'data' => array(
                'status' => 200
            )
        )
    );
}

// Rafraîchir un token JWT
function jwt_auth_refresh_token($request) {
    $token = $request->get_param('token');
    
    if (empty($token)) {
        return new WP_Error('jwt_auth_no_token', 'Token is required.', array('status' => 400));
    }

    $user = jwt_auth_verify_token($token);
    if (is_wp_error($user)) {
        return $user;
    }

    // Générer un nouveau token
    $new_token = jwt_auth_create_token($user);
    
    return array(
        'success' => true,
        'data' => array(
            'token' => $new_token,
            'user_email' => $user->user_email,
            'user_nicename' => $user->user_nicename,
            'user_display_name' => $user->display_name,
        )
    );
}

// Créer un token JWT simple
function jwt_auth_create_token($user) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'iss' => get_site_url(),
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60), // 24 heures
        'user_id' => $user->ID,
        'username' => $user->user_login
    ]);

    $base64_header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $base64_payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, JWT_AUTH_SECRET_KEY, true);
    $base64_signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    return $base64_header . "." . $base64_payload . "." . $base64_signature;
}

// Vérifier un token JWT
function jwt_auth_verify_token($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return new WP_Error('jwt_auth_invalid_token', 'Invalid token format.', array('status' => 401));
    }

    list($base64_header, $base64_payload, $base64_signature) = $parts;

    // Vérifier la signature
    $signature = hash_hmac('sha256', $base64_header . "." . $base64_payload, JWT_AUTH_SECRET_KEY, true);
    $base64_signature_check = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    if ($base64_signature !== $base64_signature_check) {
        return new WP_Error('jwt_auth_invalid_token', 'Invalid token signature.', array('status' => 401));
    }

    // Décoder le payload
    $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64_payload)), true);
    
    if (!$payload) {
        return new WP_Error('jwt_auth_invalid_token', 'Invalid token payload.', array('status' => 401));
    }

    // Vérifier l'expiration
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return new WP_Error('jwt_auth_expired_token', 'Token has expired.', array('status' => 401));
    }

    // Récupérer l'utilisateur
    $user = get_user_by('id', $payload['user_id']);
    if (!$user) {
        return new WP_Error('jwt_auth_invalid_user', 'User not found.', array('status' => 401));
    }

    return $user;
}

// Ajouter les en-têtes CORS
add_action('rest_api_init', 'jwt_auth_cors_headers');

function jwt_auth_cors_headers() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', 'jwt_auth_cors_headers_callback');
}

function jwt_auth_cors_headers_callback($value) {
    $origin = get_http_origin();
    $allowed_origins = array(
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'http://localhost:3006',
    );

    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: ' . $allowed_origins[0]);
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
    header('Access-Control-Max-Age: 86400');

    return $value;
}

// Gérer les requêtes OPTIONS
add_action('init', 'jwt_auth_handle_preflight');

function jwt_auth_handle_preflight() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();
        $allowed_origins = array(
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
            'http://localhost:3003',
            'http://localhost:3004',
            'http://localhost:3005',
            'http://localhost:3006',
        );

        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            header('Access-Control-Allow-Origin: ' . $allowed_origins[0]);
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        header('Access-Control-Max-Age: 86400');
        exit;
    }
}