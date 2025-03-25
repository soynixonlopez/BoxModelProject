document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    const lessons = document.querySelectorAll('.lesson');
    const feedback = document.querySelector('.feedback-text');
    
    // Lesson 1: Box Model Understanding
    const draggables = document.querySelectorAll('.draggable');
    const dropZones = document.querySelectorAll('.drop-zone');
    let draggedElement = null;
    let completedZones = new Set();
    
    // Lesson 2: Interactive Boxes
    const dimensionControls = document.querySelectorAll('.dimension-control');
    const boxes = {
        box1: document.getElementById('box1'),
        box2: document.getElementById('box2')
    };

    // Lesson 3: Box Sizing
    const sizingWidthInput = document.getElementById('sizingWidth');
    const sizingHeightInput = document.getElementById('sizingHeight');
    const sizingPaddingInput = document.getElementById('sizingPadding');
    const sizingMarginInput = document.getElementById('sizingMargin');
    const sizingBorderInput = document.getElementById('sizingBorder');
    const contentBoxDemo = document.getElementById('contentBoxDemo');
    const borderBoxDemo = document.getElementById('borderBoxDemo');

    // Lesson 4: Clockwise Rule
    const clockwiseBox = document.querySelector('.clockwise-box');
    const directions = document.querySelectorAll('.direction');
    const propertyBtns = document.querySelectorAll('.property-btn');
    const valueInputs = document.querySelectorAll('.clockwise-input');
    const codeDisplay = document.querySelector('.code-display');
    const demoContent = document.querySelector('.demo-content');
    const valueDisplays = document.querySelectorAll('.value-display');

    let currentLesson = 1;

    // Lesson Navigation
    lessonButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.lesson-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Hide all lessons
            document.querySelectorAll('.lesson').forEach(lesson => lesson.classList.add('hidden'));
            // Show selected lesson
            const lessonNumber = button.getAttribute('data-lesson');
            showLesson(lessonNumber);
            
            // Actualizar mensaje de feedback
            updateFeedback(lessonNumber);
        });
    });

    // Lesson 1: Drag and Drop functionality
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', (e) => {
            draggedElement = draggable;
            draggable.classList.add('dragging');
            e.dataTransfer.setData('text/plain', draggable.getAttribute('data-type'));
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            draggedElement = null;
        });
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!completedZones.has(zone.getAttribute('data-zone'))) {
                zone.classList.add('highlight');
            }
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('highlight');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('highlight');
            
            const draggedType = e.dataTransfer.getData('text/plain');
            const zoneType = zone.getAttribute('data-zone');
            
            if (draggedType === zoneType && !completedZones.has(zoneType)) {
                completedZones.add(zoneType);
                
                // Update zone appearance
                zone.style.backgroundColor = `var(--color-${draggedType})`;
                zone.style.opacity = '0.6';
                zone.classList.add('filled');
                
                // Update label
                const label = zone.querySelector('.zone-label');
                if (label) {
                    label.textContent = draggedType.charAt(0).toUpperCase() + draggedType.slice(1);
                    label.classList.add('placed');
                }
                
                // Disable dragged element
                draggedElement.style.opacity = '0.5';
                draggedElement.style.cursor = 'not-allowed';
                draggedElement.setAttribute('draggable', 'false');
                
                checkLesson1Completion();
            } else {
                showFeedback(
                    completedZones.has(zoneType) 
                        ? 'This zone is already filled!' 
                        : 'Try again! Each element has its specific place.',
                    completedZones.has(zoneType) ? 'warning' : 'error'
                );
                
                // Shake animation for incorrect placement
                zone.classList.add('incorrect');
                setTimeout(() => zone.classList.remove('incorrect'), 500);
            }
        });
    });

    // Lesson 2: Box Dimensions
    dimensionControls.forEach(control => {
        control.addEventListener('input', (e) => {
            const boxNumber = e.target.getAttribute('data-box');
            const property = e.target.getAttribute('data-property');
            const direction = e.target.getAttribute('data-direction') || 'all';
            const value = e.target.value;
            const box = boxes[`box${boxNumber}`];
            const valueDisplay = e.target.nextElementSibling;
            
            updateBoxDimension(box, property, value, direction);
            valueDisplay.textContent = `${value}px`;
            updateBoxModelColors(box);
            updateDimensionLabels(box, boxNumber);
        });
    });

    function updateBoxDimension(box, property, value, direction = 'all') {
        const content = box.querySelector('.box-content');
        
        if (property === 'padding' || property === 'margin') {
            if (direction === 'all') {
                content.style[property] = `${value}px`;
            } else {
                content.style[`${property}${direction.charAt(0).toUpperCase() + direction.slice(1)}`] = `${value}px`;
            }
        } else if (property === 'width') {
            content.style.width = `${value}px`;
        } else if (property === 'height') {
            content.style.height = `${value}px`;
        } else if (property === 'border') {
            content.style.borderWidth = `${value}px`;
        }
    }

    function updateBoxModelColors(box) {
        const content = box.querySelector('.box-content');
        content.style.backgroundColor = 'var(--color-content)';
        content.style.borderColor = 'var(--color-border)';
        content.style.position = 'relative';
        
        // Add visual indicators for padding and margin
        const paddingIndicator = box.querySelector('.padding-indicator') || document.createElement('div');
        paddingIndicator.className = 'padding-indicator';
        paddingIndicator.style.backgroundColor = 'var(--color-padding)';
        
        const marginIndicator = box.querySelector('.margin-indicator') || document.createElement('div');
        marginIndicator.className = 'margin-indicator';
        marginIndicator.style.backgroundColor = 'var(--color-margin)';
        
        if (!box.querySelector('.padding-indicator')) {
            box.appendChild(paddingIndicator);
            box.appendChild(marginIndicator);
        }
    }

    function updateDimensionLabels(box, boxNumber) {
        const content = box.querySelector('.box-content');
        const labels = box.querySelectorAll('.dimension-labels span');
        const styles = window.getComputedStyle(content);
        
        labels.forEach(label => {
            if (label.classList.contains('width-label')) {
                label.textContent = `width: ${Math.round(parseFloat(styles.width))}px`;
            } else if (label.classList.contains('height-label')) {
                label.textContent = `height: ${Math.round(parseFloat(styles.height))}px`;
            } else if (label.classList.contains('padding-label')) {
                const padding = {
                    top: Math.round(parseFloat(styles.paddingTop)),
                    right: Math.round(parseFloat(styles.paddingRight)),
                    bottom: Math.round(parseFloat(styles.paddingBottom)),
                    left: Math.round(parseFloat(styles.paddingLeft))
                };
                label.textContent = `padding: ${Object.values(padding).join('px ')}px`;
            } else if (label.classList.contains('margin-label')) {
                const margin = {
                    top: Math.round(parseFloat(styles.marginTop)),
                    right: Math.round(parseFloat(styles.marginRight)),
                    bottom: Math.round(parseFloat(styles.marginBottom)),
                    left: Math.round(parseFloat(styles.marginLeft))
                };
                label.textContent = `margin: ${Object.values(margin).join('px ')}px`;
            } else if (label.classList.contains('border-label')) {
                label.textContent = `border: ${Math.round(parseFloat(styles.borderWidth))}px`;
            }
        });
    }

    // Lesson 3: Box Sizing
    function initializeBoxSizingControls() {
        const updateBoxSizing = () => {
            const width = parseInt(sizingWidthInput.value);
            const height = parseInt(sizingHeightInput.value);
            const padding = parseInt(sizingPaddingInput.value);
            const margin = parseInt(sizingMarginInput.value);
            const border = parseInt(sizingBorderInput.value);

            // Update Content Box
            const contentBoxTotalWidth = width + (padding * 2) + (border * 2);
            const contentBoxTotalHeight = height + (padding * 2) + (border * 2);
            
            contentBoxDemo.style.width = `${width}px`;
            contentBoxDemo.style.height = `${height}px`;
            contentBoxDemo.style.margin = `${margin}px`;
            contentBoxDemo.querySelector('.box-inner').style.padding = `${padding}px`;
            contentBoxDemo.querySelector('.box-inner').style.borderWidth = `${border}px`;
            
            contentBoxDemo.querySelector('.total-width').textContent = `${contentBoxTotalWidth}px`;
            contentBoxDemo.querySelector('.total-height').textContent = `${contentBoxTotalHeight}px`;
            contentBoxDemo.querySelector('.content-width').textContent = `${width}px`;
            contentBoxDemo.querySelector('.content-height').textContent = `${height}px`;

            // Update Border Box
            const borderBoxContentWidth = width - (padding * 2) - (border * 2);
            const borderBoxContentHeight = height - (padding * 2) - (border * 2);
            
            borderBoxDemo.style.width = `${width}px`;
            borderBoxDemo.style.height = `${height}px`;
            borderBoxDemo.style.margin = `${margin}px`;
            borderBoxDemo.querySelector('.box-inner').style.padding = `${padding}px`;
            borderBoxDemo.querySelector('.box-inner').style.borderWidth = `${border}px`;
            
            borderBoxDemo.querySelector('.total-width').textContent = `${width}px`;
            borderBoxDemo.querySelector('.total-height').textContent = `${height}px`;
            borderBoxDemo.querySelector('.content-width').textContent = `${borderBoxContentWidth}px`;
            borderBoxDemo.querySelector('.content-height').textContent = `${borderBoxContentHeight}px`;

            // Update value displays
            document.querySelectorAll('.value-display').forEach(display => {
                const input = display.previousElementSibling;
                if (input && input.type === 'range') {
                    display.textContent = `${input.value}px`;
                }
            });
        };

        // Add event listeners to all inputs
        [sizingWidthInput, sizingHeightInput, sizingPaddingInput, sizingMarginInput, sizingBorderInput].forEach(input => {
            if (input) {
                input.addEventListener('input', updateBoxSizing);
                input.addEventListener('change', updateBoxSizing);
            }
        });

        // Initial update
        updateBoxSizing();
    }

    function showFeedback(message, type) {
        const feedback = document.querySelector('.feedback-text');
        feedback.textContent = message;
        feedback.parentElement.className = 'feedback ' + type;
        setTimeout(() => {
            feedback.parentElement.className = 'feedback';
        }, 1500);
    }

    function checkLesson1Completion() {
        if (document.querySelectorAll('.drop-zone.filled').length === 4) {
            showFeedback('Excellent! You have correctly completed the Box Model! 🎉', 'success');
        }
    }

    function updateFeedback(lessonNumber) {
        switch(lessonNumber) {
            case '1':
                feedback.textContent = 'Drag each element to its corresponding zone in the Box Model.';
                break;
            case '2':
                feedback.textContent = 'Adjust the dimensions of the elements and observe how they change.';
                break;
            case '3':
                feedback.textContent = 'Explore how Box Sizing affects the final dimensions.';
                break;
            case '4':
                feedback.textContent = 'Apply the Clockwise Rule to the Box Model.';
                break;
        }
    }

    // Lesson 4: Clockwise Rule
    function initLesson4() {
        const clockwiseBox = document.querySelector('.clockwise-box');
        const directions = document.querySelectorAll('.direction');
        const propertyBtns = document.querySelectorAll('.property-btn');
        const valueInputs = document.querySelectorAll('.clockwise-input');
        const codeDisplay = document.querySelector('.code-display');
        const demoContent = document.querySelector('.demo-content');

        let currentProperty = 'margin';
        let values = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        // Initialize property buttons
        propertyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                propertyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentProperty = btn.dataset.property;
                updateBox();
                updateShorthand();
            });
        });

        // Initialize value inputs
        valueInputs.forEach(input => {
            const direction = input.dataset.direction;
            const valueDisplay = input.parentElement.querySelector('.value-display');
            
            // Set initial values
            input.value = values[direction];
            valueDisplay.textContent = `${values[direction]}px`;
            
            input.addEventListener('input', () => {
                const direction = input.dataset.direction;
                values[direction] = parseInt(input.value);
                valueDisplay.textContent = `${input.value}px`;
                updateBox();
                updateShorthand();
                highlightDirection(direction);
            });
        });

        function highlightDirection(direction) {
            directions.forEach(d => d.classList.remove('active'));
            const directionElement = document.querySelector(`.direction.${direction}`);
            if (directionElement) {
                directionElement.classList.add('active');
                setTimeout(() => {
                    directionElement.classList.remove('active');
                }, 1000);
            }
        }

        function updateBox() {
            const { top, right, bottom, left } = values;
            
            if (currentProperty === 'margin') {
                demoContent.style.margin = `${top}px ${right}px ${bottom}px ${left}px`;
            } else if (currentProperty === 'padding') {
                demoContent.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
            } else if (currentProperty === 'border') {
                demoContent.style.border = 'solid';
                demoContent.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
                demoContent.style.borderColor = 'var(--color-border)';
            }
        }

        function updateShorthand() {
            const { top, right, bottom, left } = values;
            let shorthand = '';
            
            // All values are the same
            if (top === right && right === bottom && bottom === left) {
                shorthand = `${top}px`;
            }
            // Vertical values are the same, horizontal values are the same
            else if (top === bottom && right === left) {
                shorthand = `${top}px ${right}px`;
            }
            // Top and bottom are different, sides are the same
            else if (right === left) {
                shorthand = `${top}px ${right}px ${bottom}px`;
            }
            // All values are different
            else {
                shorthand = `${top}px ${right}px ${bottom}px ${left}px`;
            }

            const propertyName = currentProperty === 'border' ? 'border-width' : currentProperty;
            codeDisplay.innerHTML = `<span class="property-name">${propertyName}</span>: <span class="shorthand-value">${shorthand};</span>`;
        }

        // Initialize with margin selected and default values
        updateBox();
        updateShorthand();
    }

    // Update showLesson function
    function showLesson(lessonNumber) {
        document.querySelectorAll('.lesson').forEach(lesson => {
            lesson.classList.add('hidden');
            lesson.style.display = 'none';
        });
        const selectedLesson = document.querySelector(`#lesson${lessonNumber}`);
        selectedLesson.classList.remove('hidden');
        selectedLesson.style.display = 'block';
        
        // Initialize the appropriate lesson
        if (lessonNumber === '1') {
            // Lesson 1 initialization is handled by drag and drop events
        } else if (lessonNumber === '2') {
            // Lesson 2 initialization is handled by dimension controls
        } else if (lessonNumber === '3') {
            initializeBoxSizingControls();
        } else if (lessonNumber === '4') {
            initLesson4();
        }
    }

    // Initialize first lesson on page load
    showLesson('1');
}); 