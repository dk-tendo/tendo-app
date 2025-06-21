module.exports = {
  theme: {
    extend: {
      overflowWrap: {
        anywhere: 'anywhere',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.overflow-wrap-anywhere': {
          overflowWrap: 'anywhere',
        },
      });
    },
  ],
};
