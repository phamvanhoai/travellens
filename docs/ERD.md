# Travel360 ERD

## Core Category Split

```text
DestinationCategory 1 --- N TravelDestination
TourCategory        1 --- N Tour
```

`Location` and `Map` do not have category relationships.

## Main Relationships

```text
users 1 --- N booking
users 1 --- N blog
users 1 --- N review

destination_category 1 --- N travel_destination
travel_destination   1 --- N tour
travel_destination   1 --- N location

tour_category 1 --- N tour
tour          1 --- N booking
booking       1 --- N booking_detail
booking       1 --- N payment

location 1 --- N map
location 1 --- N view360
view360  1 --- N view360_image
location 1 --- N review

blog N --- N location through blog_location
```

## Entity Notes

### DestinationCategory

- `destination_category_id`
- `name`
- `description`
- `created_at`
- `updated_at`

Examples: Historical, Nature, Beach, Mountain, Museum.

### TourCategory

- `tour_category_id`
- `name`
- `description`
- `created_at`
- `updated_at`

Examples: Family, Adventure, Luxury, Budget, Couple.

### TravelDestination

Represents the overall destination. It belongs to `DestinationCategory` and has many `Tour` and `Location` records.

### Tour

Represents a trip/package. It belongs to `TravelDestination` and `TourCategory`, and supports booking/payment flows.

### Location

Represents a specific area inside a `TravelDestination`. It has many maps, View360 records, and reviews. It has no category.

### Map

Stores map/schematic/location guide files for a `Location`. It has no category.

