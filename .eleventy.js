module.exports = function(eleventyConfig) {
  // Copy the CSS folder to the output (_site)
  eleventyConfig.addPassthroughCopy("assets/css");
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("assets/images");
  eleventyConfig.addPassthroughCopy("quizzes");
   eleventyConfig.addTemplateFormats("md");

  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
