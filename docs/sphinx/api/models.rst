Data Models
===========

This section describes the main data models used in the PawSpace API.

Space
-----

.. code-block:: typescript

    interface Space {
        id: string;
        title: string;
        description: string;
        price_per_hour: number;
        location: {
            address: string;
            city: string;
            postal_code: string;
            coordinates: {
                lat: number;
                lng: number;
            };
        };
        amenities: string[];
        images: string[];
        rating: number;
        reviews_count: number;
        host: {
            id: string;
            name: string;
            rating: number;
            verified: boolean;
        };
        availability: {
            schedule: {
                [day: string]: string[];  // Array of time ranges
            };
            exceptions: {
                date: string;
                available: boolean;
                reason?: string;
            }[];
        };
    }

Booking
-------

.. code-block:: typescript

    interface Booking {
        booking_id: string;
        status: "pending" | "confirmed" | "cancelled" | "completed";
        space: {
            id: string;
            title: string;
        };
        schedule: {
            date: string;  // YYYY-MM-DD
            start_time: string;  // HH:MM
            end_time: string;    // HH:MM
        };
        dogs: {
            id: string;
            name: string;
        }[];
        total_price: number;
        payment_status: "pending" | "paid" | "refunded";
        special_requests?: string;
        created_at: string;      // ISO 8601
        last_updated: string;    // ISO 8601
    }

Review
------

.. code-block:: typescript

    interface Review {
        review_id: string;
        space_id: string;
        user: {
            id: string;
            name: string;
            avatar?: string;
        };
        rating: number;          // 1-5
        comment: string;
        visit_date: string;      // YYYY-MM-DD
        images?: string[];
        helpful_votes: number;
        created_at: string;      // ISO 8601
        status: "pending" | "published" | "removed";
    }

User
----

.. code-block:: typescript

    interface User {
        id: string;
        email: string;
        name: string;
        avatar?: string;
        phone?: string;
        dogs: {
            id: string;
            name: string;
            breed: string;
            age: number;
            size: "small" | "medium" | "large";
            vaccinated: boolean;
        }[];
        created_at: string;      // ISO 8601
        verified: boolean;
        preferences: {
            notification_email: boolean;
            notification_sms: boolean;
            newsletter: boolean;
        };
    }

Error
-----

.. code-block:: typescript

    interface Error {
        code: string;
        message: string;
        details?: {
            field?: string;
            reason?: string;
        }[];
        request_id: string;
    }
