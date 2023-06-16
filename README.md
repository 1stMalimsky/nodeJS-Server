# bizcard server

The bizcard server handles the database created by "users" who can sign up and create their own business cards. Users have full CRUD abilities and are classified as admins, business users, or regular users. Each class affords users different permissions.

## Installation

To install the server, please follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Install the dependencies by running the following command: npm i

Once the dependencies are installed, start the server using the command:

Production mode -
npm start

Developer mode -
npm run dev

The server will start running on the default port (localport 8181).

## API Endpoints

### Users

- **Register a new user**
- Method: POST
- Endpoint: `/api/user/users`
- Data Requirements:

```json
{
  "name": {
    "firstName": "string (min 2 digits, max 225, required)",
    "middleName": "string (min 2 characters, max 225)",
    "lastName": "string (min 2 characters, max 225, required)"
  },
  "isBusiness": "boolean (required)",
  "phone": "string (10 digits, required)",
  "password": "string (minimum 9 characters, with at least one uppercase letter, one lowercase letter, one number, and one special sign (!@#$))",
  "email": "string (valid email structure)",
  "address": {
    "state": "string (min 3 characters, max 255)",
    "country": "string (min 3 characters, max 255, required)",
    "city": "string (min 3 characters, max 255, required)",
    "street": "string (min 3 characters, max 255, required)",
    "houseNumber": "string (min 3 characters, max 255, required)",
    "zipcode": "string (min 3 characters, max 255)"
  },
  "image": {
    "url": "string (valid image URL)",
    "alt": "string (min 2 characters, max 255)"
  }
}
```

- **Login user**
- Method: POST
- Endpoint: `/api/user/users/login`
- Data Requirements:

```json
{
  "email": "string (valid email address)",
  "password": "string (min 9 characters, max 255)"
}
```

- **View all users**
- Method: GET
- Endpoint: `/api/user/users`
- Data Requirements: A valid token must be provided. Only admins can view all users.

- **Search for a user by ID**
- Method: GET
- Endpoint: `/api/user/:id`
- Data Requirements: A valid token must be provided. Admins and the same card users can search for users.

- **Edit user**
- Method: PUT
- Endpoint: `/api/user/:id`
- Data Requirements:

```json
{
  "name": {
    "firstName": "string (min 2 digits, max 225, required)",
    "middleName": "string (min 2 characters, max 225)",
    "lastName": "string (min 2 characters, max 225, required)"
  },
  "isBusiness": "boolean (required)",
  "phone": "string (10 digits, required)",
  "password": "string (minimum 9 characters, with at least one uppercase letter, one lowercase letter, one number, and one special sign (!@#$))",
  "address": {
    "state": "string (min 3 characters, max 255)",
    "country": "string (min 3 characters, max 255, required)",
    "city": "string (min 3 characters, max 255, required)",
    "street": "string (min 3 characters, max 255, required)",
    "houseNumber": "string (min 3 characters, max 255, required)",
    "zipcode": "string (min 3 characters, max 255)"
  },
  "image": {
    "url": "string (valid image URL)",
    "alt": "string (min 2 characters, max 255)"
  }
}
```

Must provide a valid token. Users can only edit their own profiles.

- **Change business account status**
- Method: PATCH
- Endpoint: `/api/user/:id`
- Data Requirements: Must provide a valid token. Users can only edit their own profiles.

- **Delete a user**
- Method: DELETE
- Endpoint: `/api/user/:id`
- Data Requirements: Must provide a valid token. Users can only delete their own profiles, while admins can delete any profile.

### Cards

- **Create card**
- Method: POST
- Endpoint: `/api/cards`
- Data Requirements:

```json
{
  "title": "string (min 2 characters, max 255, required)",
  "subTitle": "string (min 2 characters, max 255, required)",
  "description": "string (min 2 characters, max 255, required)",
  "phone": "string (10 digits, required)",
  "email": "string (valid email structure, required)",
  "web": "URL (valid web address)",
  "image": {
    "url": "string (valid image URL)",
    "alt": "string (min 2 characters, max 255)"
  },
  "address": {
    "state": "string (min 2 characters, max 255)",
    "country": "string (min 2 characters, max 255, required)",
    "street": "string (min 2 characters, max 255, required)",
    "houseNumber": "string (min 2 characters, max 255, required)",
    "zipcode": "string"
  }
}
```

Must provide valid token. User must be logged in and of a business user class.

- **View all cards**
- Method: GET
- Endpoint: `/api/cards/`
- Data Requirements: None. All visitors can view all cards.

- **Find card by ID**
- Method: GET
- Endpoint: `/api/cards/:id`
- Data Requirements: None. All visitors can view all cards.

- **View your own cards**
- Method: GET
- Endpoint: `/api/cards/my-cards`
- Data Requirements: Must provide a valid token.

- **Edit card**
- Method: PUT
- Endpoint: `/api/cards/:id`
- Data Requirements:

```json
{
  "title": "string (min 2 characters, max 255, required)",
  "subTitle": "string (min 2 characters, max 255, required)",
  "description": "string (min 2 characters, max 255, required)",
  "phone": "string (10 digits, required)",
  "email": "string (valid email structure, required)",
  "web": "URL (valid web address)",
  "image": {
    "url": "string (valid image URL)",
    "alt": "string (min 2 characters, max 255)"
  },
  "address": {
    "state": "string (min 2 characters, max 255)",
    "country": "string (min 2 characters, max 255, required)",
    "street": "string (min 2 characters, max 255, required)",
    "houseNumber": "string (min 2 characters, max 255, required)",
    "zipcode": "string"
  }
}
```

Must provide a valid token. A card can only be edited by its creator.

- **Like a card**
- Method: PATCH
- Endpoint: `/api/cards/:id`
- Data Requirements: Must provide a valid token. Only logged-in users can like a card.

- **Delete card**
- Method: DELETE
- Endpoint: `/api/cards/:id`
- Data Requirements: Must provide a valid token. A card can only be deleted by its owner or any admin.

## Contact

For any further information or inquiries, please feel free to contact:

- Name: Alon Malimsky
- Phone: 0534303677
- Email: alonamlimsky@gmail.com
