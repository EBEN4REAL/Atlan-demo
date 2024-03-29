/**
 * Modified version from here: http://davidwalsh.name/convert-xml-json
 * Changes are added for Atlan usecase
 * Not added in Vue plugin since it's not needed globally
 * 
 * @param {string} xml XML DOM tree
 * 
 * Usage:
 * 1. If you have an XML file URL:
 * const response = await fetch('file_url');
 * const xmlString = await response.text();
 * var XmlNode = new DOMParser().parseFromString(xmlString, 'text/xml');
 * xmlToJson(XmlNode);
 * 
 * 2. If you have an XML as string:
 * var XmlNode = new DOMParser().parseFromString(yourXmlString, 'text/xml');
 * xmlToJson(XmlNode);
 * 
 * 3. If you have the XML as a DOM Node:
 * xmlToJson(YourXmlNode);
 * 
 */
const xmlToJson = (xml) => {
    // Create the return object
    let obj = {};
  
    if (xml.nodeType == 1) {
      // element
      // do attributes
      if (xml.attributes.length > 0) {
        obj.$ = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj.$[attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) {
      // text
      console.log(xml.nodeValue)
      obj = xml.nodeValue;
    }
  
    // do children
    // If all text nodes inside, get concatenated text from them.
    const textNodes = [].slice.call(xml.childNodes).filter((node) => node.nodeType === 3);

    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
      obj = [].slice.call(xml.childNodes).reduce((text, node) => text + node.nodeValue, "");
    } else if (xml.hasChildNodes()  ) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const {nodeName} = item;
        if (typeof obj[nodeName] === "undefined") {
          // This creates the required structure but adds an array to root node too. Have to add condition check for that
          // obj[nodeName] = [];
          // obj[nodeName].push(xmlToJson(item));
          obj[nodeName] = xmlToJson(item); 
        } else {
          if (typeof obj[nodeName].push === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(xmlToJson(item));
        }
      }
    }
    return obj;
  }

  export default xmlToJson;
  