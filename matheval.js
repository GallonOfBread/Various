function calculateMathExpression(exp) {
    // Helper function to perform operations
    const performOperation = (num1, operator, num2) => {
        switch (operator) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                return num1 / num2;
            case '^':
                return Math.pow(num1, num2);
            default:
                throw new Error('Invalid operator.');
        }
    };

    // Helper function to perform mathematical functions
    const performFunction = (func, num) => {
        switch (func) {
            case 'sqrt':
                return Math.sqrt(num);
            case 'abs':
                return Math.abs(num);
            case 'ln':
                return Math.log(num); // natural logarithm (base e)
            case 'log':
                return Math.log10(num); // logarithm (base 10)
            case 'sin':
                return Math.sin(num);
            case 'cos':
                return Math.cos(num);
            case 'tan':
                return Math.tan(num);
            case 'asin':
                return Math.asin(num);
            case 'acos':
                return Math.acos(num);
            case 'atan':
                return Math.atan(num);
            case 'sec':
                return 1 / Math.cos(num);
            case 'csc':
                return 1 / Math.sin(num);
            case 'cot':
                return 1 / Math.tan(num);
            default:
                throw new Error('Invalid function.');
        }
    };

    const operators = ['+', '-', '*', '/', '^'];
    const functions = ['sqrt', 'abs', 'ln', 'log', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sec', 'csc', 'cot'];
    const precedence = {
        '^': 3,
        '*': 2,
        '/': 2,
        '+': 1,
        '-': 1,
    };

    const stack = [];
    const outputQueue = [];
    let numBuffer = '';
    let funcBuffer = '';

    // Tokenize the expression
    for (let i = 0; i < exp.length; i++) {
        const token = exp[i];
        if (token === ' ') {
            continue;
        } else if (operators.includes(token)) {
            while (stack.length > 0 && precedence[token] <= precedence[stack[stack.length - 1]]) {
                outputQueue.push(stack.pop());
            }
            stack.push(token);
        } else if (token === '(') {
            if (funcBuffer) {
                stack.push(funcBuffer); // Push function to stack
                funcBuffer = '';
            }
            stack.push(token);
        } else if (token === ')') {
            while (stack[stack.length - 1] !== '(') {
                outputQueue.push(stack.pop());
            }
            stack.pop(); // Remove '('
            if (functions.includes(stack[stack.length - 1])) {
                outputQueue.push(stack.pop()); // Move the function to the output queue
            }
        } else if (/[a-zA-Z]/.test(token)) {
            // If it's part of a function name, append it to funcBuffer
            funcBuffer += token;
        } else {
            // Append digits to numBuffer until encountering an operator or parenthesis
            numBuffer += token;
            if (i === exp.length - 1 || operators.includes(exp[i + 1]) || exp[i + 1] === '(' || exp[i + 1] === ')' || /[a-zA-Z]/.test(exp[i + 1])) {
                outputQueue.push(parseFloat(numBuffer));
                numBuffer = '';
            }
        }
    }

    // Empty the operator stack
    while (stack.length > 0) {
        outputQueue.push(stack.pop());
    }

    // Evaluate the expression using the output queue and a stack
    const evalStack = [];
    for (const token of outputQueue) {
        if (typeof token === 'number') {
            evalStack.push(token);
        } else if (operators.includes(token)) {
            const num2 = evalStack.pop();
            const num1 = evalStack.pop();
            evalStack.push(performOperation(num1, token, num2));
        } else if (functions.includes(token)) {
            const num = evalStack.pop();
            evalStack.push(performFunction(token, num));
        } else {
            throw new Error('Invalid token in output queue.');
        }
    }

    if (evalStack.length === 1) {
        return evalStack[0];
    } else {
        throw new Error('Invalid expression.');
    }
}
