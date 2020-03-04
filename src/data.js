const slides = require('./slides');

// Define the copy to allow for easier localisation
const copy = {
  nav: {
    prev: 'Previous',
    next: 'Next',
  },
  company: {
    name: 'Lxlabs',
  },
  title: 'Everyone loves a giant PowerPoint',
};

// Generate the context
const context = {
  colophon: `&copy; ${new Date().getFullYear()} ${copy.company.name}`,
  copy,
  slides,
  config: {
    delay: 10000, // in milliseconds
  },
};

module.exports = context;
