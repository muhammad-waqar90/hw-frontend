import DOMPurify from "dompurify";

export default {
  methods: {
    sanitizeInputWithWhitelist(value) {
      const WHITELISTED_TAGS = [
        "h2",
        "h3",
        "h4",
        "p",
        "strong",
        "i",
        "a",
        "ul",
        "li",
        "ol",
        "blockquote",
        "figure",
        "table",
        "tbody",
        "tr",
        "td",
      ];

      DOMPurify.setConfig({
        //USE_PROFILES: { html: true },  Only allow HTML
        IN_PLACE: true, // In place mode for faster sanitization,
        ALLOWED_TAGS: WHITELISTED_TAGS, // Only allow tags specified in the whitelist above
        ADD_ATTR: ["target"], // Allow elements with the target attribute
      });
      const sanitizedValue = DOMPurify.sanitize(value);
      if (sanitizedValue == value) {
        return true;
      } else return false;
    },

    sanitizeInput(value) {
      DOMPurify.setConfig({
        IN_PLACE: true, // In place mode for faster sanitization,
      });
      const sanitizedValue = DOMPurify.sanitize(value);
      const regex = /^(ftp|http|https):\/\/[^"]+|^[A-Za-z0-9_,:; ?.-]*$/; // Allowed special character with URL,
      const isValid = regex.test(sanitizedValue);
      if (sanitizedValue == value && isValid) {
        return true;
      } else return false;
    },

    sanitizePath(value) {
      if (!value) return true;

      DOMPurify.setConfig({
        IN_PLACE: true, // In place mode for faster sanitization,
      });
      const sanitizedValue = DOMPurify.sanitize(value);
      const regex = /^[A-Za-z0-9_,:; .?/-]*$/; // Allowed special character,
      const isValid = regex.test(sanitizedValue);
      if (sanitizedValue == value && isValid) {
        return true;
      } else return false;
    },

    sanitizeSearchInput(value) {
      const sanitizedValue = DOMPurify.sanitize(value);
      const regex = /[^A-Za-z0-9_,:; .?/-]/g; // Allowed special character,
      const cleanedValue = sanitizedValue.replace(regex, "");
      return cleanedValue;
    },

    sanitizeWithBusinesslogic(value) {
      const sanitizedValue = DOMPurify.sanitize(value);
      const regex =
        /[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufbc1\ufbd3-\ufd3f\ufd50-\ufd8f\ufd50-\ufd8f\ufe70-\ufefc\uFDF0-\uFDFDA-Za-z0-9_,:; .\n?/\\!'"`~@#$%^&*+(){}[\]|<>=-]/u; // Allowed special character with arabic and enter input,
      const isValid = !regex.test(sanitizedValue);
      if (sanitizedValue == value && isValid) {
        return true;
      } else return false;
    },
  },
};
