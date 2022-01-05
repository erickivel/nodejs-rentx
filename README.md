**FR** => Functional requirements

**NFR** => Non-functional requirements (Technologies: database, framework, language)

**BR** => Business rules (Exception rules)

# Car registration

**FR** => 
- Should be possible to register a new car
- Should be possible to list all categories

**BR** => 
- Must not be able to register a new car with an existing license plate
- The car must be registered "available" by default
*The user responsible for registration must be an administrator

# Car listing

**FR**
- Should be able to list all registered cars
- Should be possible to list all available cars by category name
- Should be possible to list all available cars by brand
- Should be possible to list all available cars by name


**BR**
- The user doesn't have to be logged in to see the car list

# Specification registration

**FR**
- Should be possible to register a new specification for a car
- Should be possible to list all registered specifications
- Should be possible to list all registered car

**BR**
- Must not be able to register a new specification for a non registered car
- Must not be able to register a the same specification for the same car
- The user responsible for registration must be an administrator

# Car Image registration

**FR**
- Should be possible to register a new car image
- Should be possible to list all cars

**NFR**
- Utilize multer for files upload 

**BR**
- The user should be able to upload more than one image for the same car
- The user responsible for registration must be an administrator

# Car Rental

**FR**
- Should be possible to register a rent

**BR**
- The rent must have a minimum duration of 24 hours
- Must not be possible to register a new rent if already exist one scheduled for the same user
- The user must be logged in