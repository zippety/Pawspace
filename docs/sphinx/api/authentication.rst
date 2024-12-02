Authentication
==============

PawSpace uses JWT (JSON Web Tokens) for authentication. All authenticated API requests must include an ``Authorization`` header with a valid JWT token.

Getting a Token
-------------

To obtain a token, make a POST request to the authentication endpoint:

.. code-block:: bash

    POST /v1/auth/login

Request body:

.. code-block:: json

    {
        "email": "user@example.com",
        "password": "your-password"
    }

Response:

.. code-block:: json

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires_in": 3600
    }

Using the Token
-------------

Include the token in the ``Authorization`` header:

.. code-block:: text

    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Token Expiration
--------------

Tokens expire after 1 hour. You can refresh a token before it expires:

.. code-block:: bash

    POST /v1/auth/refresh

With the current token in the Authorization header.

Error Responses
-------------

Authentication errors return 401 or 403 status codes:

- 401: Invalid or expired token
- 403: Valid token but insufficient permissions
