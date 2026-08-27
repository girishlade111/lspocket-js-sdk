/**
 * Checks if the specified value is a file (aka. File, Blob, RN file object).
 */
export declare function isFile(val: any): boolean;
/**
 * Loosely checks if the specified body is a FormData instance.
 */
export declare function isFormData(body: any): boolean;
/**
 * Checks if the submitted body object has at least one Blob/File field value.
 */
export declare function hasFileField(body: {
    [key: string]: any;
}): boolean;
/**
 * Converts analyzes the provided body and converts it to FormData
 * in case a plain object with File/Blob values is used.
 */
export declare function convertToFormDataIfNeeded(body: any): any;
/**
 * Converts the provided FormData instance into a plain object.
 *
 * For consistency with the server multipart/form-data inferring,
 * the following normalization rules are applied for plain multipart string values:
 *   - "true" is converted to the json "true"
 *   - "false" is converted to the json "false"
 *   - numeric strings are converted to json number ONLY if the resulted
 *     minimal number string representation is the same as the provided raw string
 *     (aka. scientific notations, "Infinity", "0.0", "0001", etc. are kept as string)
 *   - any other string (empty string too) is left as it is
 */
export declare function convertFormDataToObject(formData: FormData): {
    [key: string]: any;
};
