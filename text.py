def process_text(text):
    """Remove extra whitespace and return cleaned text"""
    return ' '.join(text.split())

# Get input text
input_text = input("Enter text: ")

# Process and output result
output_text = process_text(input_text)
print(output_text)