document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.page-section');
    const exploreBtn = document.getElementById('exploreBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const cartItems = document.getElementById('cartItems');
    const userCourses = document.getElementById('userCourses');

    let currentUser = null;
    let cart = [];
    const users = [];
    const courses = [
        { id: 1, title: 'Introduction to Programming', description: 'Learn the basics of programming with Python.', image: 'course1.jpg', price: 120 },
        { id: 2, title: 'Data Structures and Algorithms', description: 'Understand data structures and algorithms to solve complex problems.', image: 'course2.jpg', price: 150 },
        { id: 3, title: 'Advanced Topics in Artificial Intelligence', description: 'Dive deep into advanced AI techniques, including neural networks.', image: 'course3.jpg', price: 200 },
        { id: 4, title: 'Database Management Systems', description: 'Explore SQL and NoSQL databases and how to manage data effectively.', image: 'course4.jpg', price: 140 },
        { id: 5, title: 'Machine Learning', description: 'Introduction to machine learning concepts and algorithms.', image: 'course5.jpg', price: 180 }
    ];

    function navigateTo(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }

    exploreBtn.addEventListener('click', () => {
        navigateTo('courses');
    });

    document.querySelectorAll('nav ul li a').forEach(navLink => {
        navLink.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = navLink.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    function loadCourses() {
        const courseGrid = document.querySelector('.course-grid');
        courseGrid.innerHTML = '';
        courses.forEach(course => {
            const courseCard = document.createElement('div');
            courseCard.classList.add('course-card');
            courseCard.innerHTML = `
                <img src="${course.image}" alt="Course Image">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <p>Price: $${course.price}</p>
                <button data-course-id="${course.id}" class="add-to-cart-btn">Add to Cart</button>
            `;
            courseGrid.appendChild(courseCard);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const courseId = parseInt(e.target.getAttribute('data-course-id'));
                addToCart(courseId);
            });
        });
    }

    function addToCart(courseId) {
        const course = courses.find(c => c.id === courseId);
        if (course) {
            const existingCourse = cart.find(c => c.id === courseId);
            if (!existingCourse) {
                cart.push(course);
                alert(`Course "${course.title}" added to cart`);
            } else {
                alert(`Course "${course.title}" is already in the cart`);
            }
            loadCart();
        } else {
            console.error(`Course with ID ${courseId} not found`);
        }
    }

    function removeFromCart(courseId) {
        cart = cart.filter(c => c.id !== courseId);
        loadCart();
    }

    function loadCart() {
        cartItems.innerHTML = '';
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
        } else {
            cart.forEach(course => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${course.image}" alt="Course Image">
                    <p>${course.title} - $${course.price}</p>
                    <button class="delete-btn" data-course-id="${course.id}">Delete</button>
                `;
                cartItems.appendChild(cartItem);
            });

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const courseId = parseInt(e.target.getAttribute('data-course-id'));
                    removeFromCart(courseId);
                });
            });

            const totalPrice = cart.reduce((sum, course) => sum + course.price, 0);
            document.getElementById('totalPrice').textContent = `Total: $${totalPrice}`;
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            currentUser = user;
            alert('Login successful');
            navigateTo('dashboard');
            loadUserCourses();
        } else {
            alert('Invalid email or password');
        }
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const newUser = { name, email, password, courses: [] };
        users.push(newUser);
        alert('Registration successful');
        navigateTo('login');
    });

    checkoutBtn.addEventListener('click', () => {
        if (!currentUser) {
            alert('You need to log in to complete the purchase');
            navigateTo('login');
            return;
        }
        currentUser.courses.push(...cart);
        cart = [];
        alert('Purchase successful');
        loadCart();
        loadUserCourses();
    });

    function loadUserCourses() {
        userCourses.innerHTML = '';
        if (currentUser && currentUser.courses.length > 0) {
            currentUser.courses.forEach(course => {
                const userCourse = document.createElement('div');
                userCourse.classList.add('user-course');
                userCourse.innerHTML = `
                    <img src="${course.image}" alt="Course Image">
                    <p>${course.title}</p>
                `;
                userCourses.appendChild(userCourse);
            });
        } else {
            userCourses.innerHTML = '<p>No courses purchased yet</p>';
        }
    }

    loadCourses();
    loadCart();
});
