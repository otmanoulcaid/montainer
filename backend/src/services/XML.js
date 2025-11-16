import fs from 'fs';
import libxmljs from 'libxmljs2';
import { XMLParser } from "fast-xml-parser";

export function parseXmlWithXsd(xmlPath, xsdPath, xmlMapper) {
    try {
        const xmlData = fs.readFileSync(xmlPath, 'utf-8');
        const xsdData = fs.readFileSync(xsdPath, 'utf-8');

        // Validation XML -> XSD
        const xmlDoc = libxmljs.parseXml(xmlData);
        const xsdDoc = libxmljs.parseXml(xsdData);

        const isValid = xmlDoc.validate(xsdDoc);
        if (!isValid) {
            console.error("Erreurs de validation XSD :", xmlDoc.validationErrors);
            throw new Error("XML invalide selon le XSD");
        }

        // Conversion XML -> JSON
        const parser = new XMLParser({
            ignoreAttributes: false,
        });
        const dataObj = parser.parse(xmlData)
        const jsonObj = xmlMapper(dataObj);
        fs.writeFileSync(xmlPath + '.json', JSON.stringify(jsonObj), 'utf-8');
    } catch (err) {
        console.error("Erreur parsing XML/XSD:", err.message);
        throw err;
    }
}

export function containerMapper(xmlJson) {
    const containers = xmlJson.containers?.container || [];    
    const result = containers.map(c => ({
        name: c.name || '',
        image: c.image?.['@_path'] || '',
        tag: c.image?.tag,
        hostPort: c.hostPort || '',
        containerPort: c.containerPort || '',
        state: c.state?.['@_type'] || '',
        status: c.status || '',
        ownerId: c.ownerId || '',
        id: c['@_id'] || '' // si tu veux garder l'id
    }));
    return result;
}

export function userMapper(xmlJSON) {

    const result = xmlJSON.users.user.map(user => ({
        matricule: user['@_id'],
        name: user.name,
        role: user.role['@_typeRole'],
        metier: user.job['@_typeJob']
    }));    
    return result;
}
