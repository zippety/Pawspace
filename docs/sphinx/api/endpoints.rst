API Endpoints
============

This section details all available API endpoints in PawSpace.

Spaces
------

List Spaces
~~~~~~~~~~

.. code-block:: text

    GET /v1/spaces

Query Parameters:

.. list-table::
   :header-rows: 1

   * - Parameter
     - Type
     - Description
   * - location
     - string
     - City or postal code
   * - date_from
     - string
     - Start date (YYYY-MM-DD)
   * - date_to
     - string
     - End date (YYYY-MM-DD)
   * - min_price
     - number
     - Minimum price per hour
   * - max_price
     - number
     - Maximum price per hour
   * - page
     - integer
     - Page number (default: 1)
   * - per_page
     - integer
     - Items per page (default: 20)

Response:

.. code-block:: json

    {
        "spaces": [
            {
                "id": "space_123",
                "title": "Large Backyard Paradise",
                "description": "Fully fenced backyard with agility equipment",
                "price_per_hour": 25.00,
                "location": {
                    "address": "123 Park Street",
                    "city": "Toronto",
                    "postal_code": "M5V 2H1",
                    "coordinates": {
                        "lat": 43.6532,
                        "lng": -79.3832
                    }
                },
                "amenities": ["fenced", "water_available", "agility_equipment"],
                "images": ["url1", "url2"],
                "rating": 4.8,
                "reviews_count": 45
            }
        ],
        "pagination": {
            "total": 150,
            "pages": 8,
            "current_page": 1,
            "per_page": 20
        }
    }

Get Space Details
~~~~~~~~~~~~~~~

.. code-block:: text

    GET /v1/spaces/{space_id}

Response:

.. code-block:: json

    {
        "id": "space_123",
        "title": "Large Backyard Paradise",
        "description": "Fully fenced backyard with agility equipment",
        "price_per_hour": 25.00,
        "location": {
            "address": "123 Park Street",
            "city": "Toronto",
            "postal_code": "M5V 2H1",
            "coordinates": {
                "lat": 43.6532,
                "lng": -79.3832
            }
        },
        "amenities": ["fenced", "water_available", "agility_equipment"],
        "images": ["url1", "url2"],
        "rating": 4.8,
        "reviews_count": 45,
        "host": {
            "id": "host_456",
            "name": "John Doe",
            "rating": 4.9,
            "verified": true
        },
        "availability": {
            "schedule": {
                "monday": ["09:00-17:00"],
                "tuesday": ["09:00-17:00"],
                "wednesday": ["09:00-17:00"],
                "thursday": ["09:00-17:00"],
                "friday": ["09:00-17:00"]
            },
            "exceptions": [
                {
                    "date": "2024-03-15",
                    "available": false,
                    "reason": "Maintenance"
                }
            ]
        }
    }

Bookings
--------

Create Booking
~~~~~~~~~~~~

.. code-block:: text

    POST /v1/bookings

Request:

.. code-block:: json

    {
        "space_id": "space_123",
        "date": "2024-03-20",
        "start_time": "14:00",
        "end_time": "16:00",
        "dogs": [
            {
                "id": "dog_789",
                "name": "Max"
            }
        ],
        "special_requests": "Please ensure water bowl is available"
    }

Response:

.. code-block:: json

    {
        "booking_id": "booking_321",
        "status": "confirmed",
        "total_price": 50.00,
        "space": {
            "id": "space_123",
            "title": "Large Backyard Paradise"
        },
        "schedule": {
            "date": "2024-03-20",
            "start_time": "14:00",
            "end_time": "16:00"
        },
        "payment_status": "pending",
        "payment_link": "https://payment.pawspace.com/booking_321"
    }

List User Bookings
~~~~~~~~~~~~~~~~

.. code-block:: text

    GET /v1/bookings

Query Parameters:

.. list-table::
   :header-rows: 1

   * - Parameter
     - Type
     - Description
   * - status
     - string
     - Filter by status (upcoming, past, cancelled)
   * - page
     - integer
     - Page number (default: 1)
   * - per_page
     - integer
     - Items per page (default: 20)

Response:

.. code-block:: json

    {
        "bookings": [
            {
                "booking_id": "booking_321",
                "status": "confirmed",
                "space": {
                    "id": "space_123",
                    "title": "Large Backyard Paradise"
                },
                "schedule": {
                    "date": "2024-03-20",
                    "start_time": "14:00",
                    "end_time": "16:00"
                },
                "total_price": 50.00,
                "payment_status": "paid"
            }
        ],
        "pagination": {
            "total": 45,
            "pages": 3,
            "current_page": 1,
            "per_page": 20
        }
    }

Reviews
-------

Create Review
~~~~~~~~~~~

.. code-block:: text

    POST /v1/spaces/{space_id}/reviews

Request:

.. code-block:: json

    {
        "rating": 5,
        "comment": "Amazing space! My dog loved the agility equipment.",
        "visit_date": "2024-03-20",
        "images": ["image_url1", "image_url2"]
    }

Response:

.. code-block:: json

    {
        "review_id": "review_456",
        "status": "published",
        "created_at": "2024-03-21T10:30:00Z",
        "rating": 5,
        "comment": "Amazing space! My dog loved the agility equipment.",
        "images": ["image_url1", "image_url2"],
        "user": {
            "id": "user_789",
            "name": "Jane Smith",
            "avatar": "avatar_url"
        }
    }

Get Space Reviews
~~~~~~~~~~~~~~

.. code-block:: text

    GET /v1/spaces/{space_id}/reviews

Query Parameters:

.. list-table::
   :header-rows: 1

   * - Parameter
     - Type
     - Description
   * - rating
     - integer
     - Filter by rating (1-5)
   * - sort
     - string
     - Sort by (newest, oldest, rating_high, rating_low)
   * - page
     - integer
     - Page number (default: 1)
   * - per_page
     - integer
     - Items per page (default: 20)

Response:

.. code-block:: json

    {
        "reviews": [
            {
                "review_id": "review_456",
                "rating": 5,
                "comment": "Amazing space! My dog loved the agility equipment.",
                "visit_date": "2024-03-20",
                "images": ["image_url1", "image_url2"],
                "user": {
                    "id": "user_789",
                    "name": "Jane Smith",
                    "avatar": "avatar_url"
                },
                "created_at": "2024-03-21T10:30:00Z",
                "helpful_votes": 12
            }
        ],
        "pagination": {
            "total": 45,
            "pages": 3,
            "current_page": 1,
            "per_page": 20
        },
        "summary": {
            "average_rating": 4.8,
            "total_reviews": 45,
            "rating_distribution": {
                "5": 35,
                "4": 8,
                "3": 2,
                "2": 0,
                "1": 0
            }
        }
    }
