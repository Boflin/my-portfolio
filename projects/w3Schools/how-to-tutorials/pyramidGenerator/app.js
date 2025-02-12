// function to generate the pyramid when the 'Generate' Button is clicked
function generatePyramid() {
  const char = document.getElementById('char').value;
  const rows = parseInt(document.getElementById('rows').value);
  let output = '';

  // Check if char is not empty and rows is a valid number
  if (!char || isNaN(rows) || rows < 1) {
    alert('Please enter a valid character and number of rows.');
    return;
  }

  // Generate pyramid
  for (let i = 1; i <= rows; i++) {
    const spaces = ' '.repeat(rows - i);
    const characters = char.repeat(2 * i - 1);
    output += spaces + characters + '\n';
  }

  // Display pyramid
  document.getElementById('pyramidOutput').textContent = output;
}
