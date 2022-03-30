<img src="./support-files/tabela-api-cars-rent.png" alt="project-overview"/>

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
- The car status must be changed to unavailable

# Car Devolution

**FR**
- Should be possible to return a car 

**BR**
- User must be logged in
- If the car is returned in less than 24 hours, one day will be charged
- After the return, the car must be liberated to another rental
- After the return, the user must be liberated to another rental
- After the return, the total amount rental must be liberated
- If the return time is after the expected return time, it should be charged a fine proportional to the days of delay.
- If there is a fine, it should be added to the rent.

# Rentals listing for users 

**FR**
- Must be possible to search all rentals for the users

**BR**
- User must be logged in

# Password Recovery

**FR**
- Must be possible to recover the password by passing the email address
- The user must receive an email with step by step for password recovery
- The user should be able to insert a new password

**BR**
- The user must inform your new password
- The link sent to recovery must expire in 3 hours
