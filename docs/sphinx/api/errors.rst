Error Handling
=============

This section describes the error codes and handling in the PawSpace API.

Error Response Format
------------------

All API errors follow this format:

.. code-block:: json

    {
        "code": "error_code",
        "message": "Human-readable error message",
        "details": [
            {
                "field": "affected_field",
                "reason": "specific reason for error"
            }
        ],
        "request_id": "unique_request_id"
    }

HTTP Status Codes
--------------

.. list-table::
   :header-rows: 1

   * - Status Code
     - Description
   * - 400
     - Bad Request - Invalid input parameters
   * - 401
     - Unauthorized - Authentication required
   * - 403
     - Forbidden - Insufficient permissions
   * - 404
     - Not Found - Resource doesn't exist
   * - 409
     - Conflict - Resource state conflict
   * - 422
     - Unprocessable Entity - Validation failed
   * - 429
     - Too Many Requests - Rate limit exceeded
   * - 500
     - Internal Server Error
   * - 503
     - Service Unavailable

Error Codes
----------

Authentication Errors
~~~~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - Code
     - Description
   * - auth_required
     - Authentication is required
   * - invalid_token
     - Invalid or expired token
   * - invalid_credentials
     - Invalid email or password

Validation Errors
~~~~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - Code
     - Description
   * - invalid_input
     - Invalid input parameters
   * - required_field
     - Required field is missing
   * - invalid_format
     - Field format is invalid

Booking Errors
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - Code
     - Description
   * - space_unavailable
     - Space is not available for requested time
   * - booking_conflict
     - Booking conflicts with existing reservation
   * - invalid_schedule
     - Invalid booking schedule
   * - past_date
     - Cannot book for past dates

Payment Errors
~~~~~~~~~~~~

.. list-table::
   :header-rows: 1

   * - Code
     - Description
   * - payment_required
     - Payment is required to complete booking
   * - payment_failed
     - Payment processing failed
   * - invalid_payment
     - Invalid payment information

Error Handling Example
-------------------

Example of handling a validation error:

.. code-block:: json

    {
        "code": "invalid_input",
        "message": "Invalid booking parameters",
        "details": [
            {
                "field": "start_time",
                "reason": "must be within space's operating hours"
            },
            {
                "field": "end_time",
                "reason": "must be after start time"
            }
        ],
        "request_id": "req_123abc"
    }

Rate Limiting
-----------

When rate limit is exceeded:

.. code-block:: json

    {
        "code": "rate_limit_exceeded",
        "message": "Too many requests",
        "details": {
            "rate_limit": 100,
            "retry_after": 60
        },
        "request_id": "req_456def"
    }

Best Practices
------------

1. Always check the HTTP status code first
2. Use the error code for programmatic handling
3. Display the message to end users
4. Log the request_id for debugging
5. Check details array for field-specific errors
6. Implement exponential backoff for rate limiting
