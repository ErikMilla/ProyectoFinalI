package com.ProyectoFinal.ProyectoFinalIntegrador.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.regex.Pattern;

/**
 * Utilidades de seguridad para archivos Excel (Versión Simplificada)
 * Solo incluye sanitización y validación básica
 */
public class ExcelSecurityUtils {
    
    private static final Logger logger = LoggerFactory.getLogger(ExcelSecurityUtils.class);
    
    // Patrones para detectar posibles inyecciones de fórmulas
    private static final Pattern FORMULA_PATTERN = Pattern.compile("^[=+\\-@].*");
    private static final int MAX_CELL_LENGTH = 32767; // Límite de Excel
    
    /**
     * Sanitiza el contenido de una celda para prevenir inyección de fórmulas
     * 
     * @param cellValue Valor de la celda a sanitizar
     * @return Valor sanitizado seguro para Excel
     */
    public static String sanitizeCellValue(String cellValue) {
        if (cellValue == null) {
            return "";
        }
        
        // Limitar longitud
        if (cellValue.length() > MAX_CELL_LENGTH) {
            cellValue = cellValue.substring(0, MAX_CELL_LENGTH - 3) + "...";
            logger.debug("Valor de celda truncado por exceder límite de longitud");
        }
        
        // Eliminar caracteres de control peligrosos
        cellValue = cellValue.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "");
        
        // Prevenir inyección de fórmulas
        if (FORMULA_PATTERN.matcher(cellValue).matches()) {
            // Agregar comilla simple al inicio para que Excel lo trate como texto
            cellValue = "'" + cellValue;
            logger.debug("Posible fórmula detectada y neutralizada");
        }
        
        // Escapar caracteres especiales de Excel
        cellValue = cellValue.replace("\"", "\"\"");
        
        return cellValue;
    }
    
    /**
     * Agrega marca de agua a un workbook
     * 
     * @param workbook Workbook al que agregar la marca de agua
     * @param watermarkText Texto de la marca de agua
     */
    public static void addWatermark(XSSFWorkbook workbook, String watermarkText) {
        if (workbook == null || watermarkText == null || watermarkText.trim().isEmpty()) {
            return;
        }
        
        try {
            // Agregar marca de agua a cada hoja como encabezado
            for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
                Sheet sheet = workbook.getSheetAt(i);
                
                // Crear encabezado con marca de agua
                Header header = sheet.getHeader();
                header.setCenter(watermarkText);
                
                // Agregar como pie de página también
                Footer footer = sheet.getFooter();
                footer.setRight("Generado: " + new java.util.Date());
            }
            
            logger.info("Marca de agua agregada exitosamente");
            
        } catch (Exception e) {
            logger.error("Error al agregar marca de agua", e);
        }
    }
    
    /**
     * Valida si una contraseña es segura
     * 
     * @param password Contraseña a validar
     * @return true si la contraseña es segura
     */
    public static boolean isSecurePassword(String password) {
        if (password == null || password.length() < 8) {
            return false;
        }
        
        // Verificar que contenga al menos:
        // - Una mayúscula
        // - Una minúscula
        // - Un número
        // - Un carácter especial
        boolean hasUpper = false;
        boolean hasLower = false;
        boolean hasDigit = false;
        boolean hasSpecial = false;
        
        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUpper = true;
            else if (Character.isLowerCase(c)) hasLower = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (!Character.isLetterOrDigit(c)) hasSpecial = true;
        }
        
        return hasUpper && hasLower && hasDigit && hasSpecial;
    }
    
    /**
     * Genera una contraseña aleatoria segura
     * 
     * @param length Longitud de la contraseña
     * @return Contraseña generada
     */
    public static String generateSecurePassword(int length) {
        if (length < 8) {
            length = 8;
        }
        
        String upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCase = "abcdefghijklmnopqrstuvwxyz";
        String digits = "0123456789";
        String special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        String allChars = upperCase + lowerCase + digits + special;
        
        StringBuilder password = new StringBuilder();
        java.util.Random random = new java.security.SecureRandom();
        
        // Asegurar al menos un carácter de cada tipo
        password.append(upperCase.charAt(random.nextInt(upperCase.length())));
        password.append(lowerCase.charAt(random.nextInt(lowerCase.length())));
        password.append(digits.charAt(random.nextInt(digits.length())));
        password.append(special.charAt(random.nextInt(special.length())));
        
        // Completar el resto
        for (int i = 4; i < length; i++) {
            password.append(allChars.charAt(random.nextInt(allChars.length())));
        }
        
        // Mezclar la contraseña
        return shuffleString(password.toString());
    }
    
    /**
     * Mezcla los caracteres de una cadena
     */
    private static String shuffleString(String input) {
        char[] chars = input.toCharArray();
        java.util.Random random = new java.security.SecureRandom();
        
        for (int i = chars.length - 1; i > 0; i--) {
            int j = random.nextInt(i + 1);
            char temp = chars[i];
            chars[i] = chars[j];
            chars[j] = temp;
        }
        
        return new String(chars);
    }
    
    /**
     * Anonimiza datos sensibles (emails, teléfonos)
     * 
     * @param data Dato a anonimizar
     * @param type Tipo de dato: "email", "phone", "name"
     * @return Dato anonimizado
     */
    public static String anonymizeData(String data, String type) {
        if (data == null || data.trim().isEmpty()) {
            return "";
        }
        
        switch (type.toLowerCase()) {
            case "email":
                // juan.perez@gmail.com -> j***@gmail.com
                int atIndex = data.indexOf("@");
                if (atIndex > 1) {
                    return data.charAt(0) + "***" + data.substring(atIndex);
                }
                return "***@***.com";
                
            case "phone":
                // 987654321 -> 987***321
                if (data.length() >= 9) {
                    return data.substring(0, 3) + "***" + data.substring(data.length() - 3);
                }
                return "***";
                
            case "name":
                // Juan Pérez -> Juan P***
                String[] parts = data.split(" ");
                if (parts.length > 1) {
                    return parts[0] + " " + parts[1].charAt(0) + "***";
                }
                return data.length() > 3 ? data.substring(0, 3) + "***" : data;
                
            default:
                return data;
        }
    }
    
    /**
     * Verifica el tamaño del archivo para prevenir ataques DoS
     * 
     * @param fileSize Tamaño del archivo en bytes
     * @param maxSizeInMB Tamaño máximo permitido en MB
     * @return true si el tamaño es válido
     */
    public static boolean isValidFileSize(long fileSize, int maxSizeInMB) {
        long maxSizeInBytes = maxSizeInMB * 1024L * 1024L;
        return fileSize > 0 && fileSize <= maxSizeInBytes;
    }
    
    /**
     * Limpia caracteres no válidos para nombres de archivo
     * 
     * @param filename Nombre de archivo a limpiar
     * @return Nombre de archivo seguro
     */
    public static String sanitizeFilename(String filename) {
        if (filename == null) {
            return "archivo";
        }
        
        // Remover caracteres no válidos para nombres de archivo
        filename = filename.replaceAll("[^a-zA-Z0-9._-]", "_");
        
        // Limitar longitud
        if (filename.length() > 200) {
            filename = filename.substring(0, 200);
        }
        
        return filename;
    }
}