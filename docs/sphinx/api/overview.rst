API Overview
===========

The PawSpace API is organized around REST principles. Our API accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes and authentication.

Base URL
--------

All API requests should be made to:

.. code-block:: text

    https://api.pawspace.com/v1/

Authentication
-------------

PawSpace uses JWT tokens for authentication. See :doc:`authentication` for details.

Rate Limiting
------------

The API implements rate limiting to ensure fair usage:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Headers will include rate limit information:

.. code-block:: text

    X-RateLimit-Limit: 100
    X-RateLimit-Remaining: 95
    X-RateLimit-Reset: 1623456789

Versioning
---------

The current API version is ``v1``. When we make backwards-incompatible changes to the API, we release a new version number.

Error Handling
------------

The API uses conventional HTTP response codes:

- 2xx for success
- 4xx for client errors
- 5xx for server errors

See :doc:`errors` for detailed error codes and handling.
