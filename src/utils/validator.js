import React, { useState } from 'react';
import clone from "lodash/clone";
import isEmpty from "lodash/isEmpty"

export function useValidator(rulez) {

    class Validator {
        constructor(rulez) {
            this.validations = {};
            this.rulez = rulez;
        }

        /**
         * Obtener objeto de validations
         * @returns {{}}
         */
        getValidations() {
            return this.validations;
        }

        /**
         * Verificar que todas las rulez se cumplan
         * Se usa para el submit
         * @returns {boolean}
         */
        isValid = () => {
            let error = false;
            Object.keys(this.rulez).forEach((id, i) => {
                this.validateById(id);
                if (!this.validations[id] || this.validations[id] !== true) {
                    if (!error) {
                        if (document.getElementById(id))
                            document.getElementById(id).focus();
                    }
                    error = true;
                }
            })
            return !error;
        };

        /**
         * Verificar rulez por id
         * @param id
         * @returns {boolean}
         */
        isValidById = (id) => {
            return !(this.validations[id] && this.validations[id] !== true);
        };

        /**
         * Devuelve el error
         * @param id
         * @returns {string|*}
         */
        getErrorById = (id) => {
            if (this.isValidById(id))
                return "";
            else
                return this.validations[id];
        };

        /**
         * Devuelve texto de ayuda
         * @param id
         * @param helperText
         * @returns {string|*}
         */
        getHelperTextById = (id, helperText) => {
            if (this.isValidById(id))
                return helperText ? helperText : "";
            else
                return this.getErrorById(id);
        }

        /**
         * Calcula validez de un campo por id
         * @param id
         */
        validateById = (id) => {
            let validation = rulez[id];
            let error = "";
            let campo = document.querySelector('input#' + id + ", textarea#" + id + ", select#" + id);
            if (validation)
                validation.forEach((itemValidation) => {
                    switch (itemValidation) {
                        case "required":
                            if (!campo || campo.value == "" || campo.value == null)
                                error += "El campo es requerido.";
                            break;
                        case "required|notDisabled":
                            if ((campo && (campo.value == "" || campo.value == null) && campo.disabled == false && (campo.getAttribute('aria-disabled') === null || campo.getAttribute('aria-disabled') == "false")))
                                error += "El campo es requerido.";
                            break;
                        case "sometimes|required":
                            if (campo && (campo.value == "" || campo.value == null))
                                error += "El campo es requerido.";
                            break;
                        default:
                            break;
                    }
                })
            if (isEmpty(error))
                error = true;
            let validations = clone(validator);
            validations.getValidations()[id] = error;
            setValidator(validations);
        };

        validate = (e) => {
            let id = e.target.id ? e.target.id : e.target.name;
            let validation = rulez[id];
            let error = "";
            if (validation)
                validation.forEach((itemValidation) => {
                    switch (itemValidation) {
                        case "required":
                            if (e.target.value === "" || e.target.value === null || !e.target.value)
                                error += "El campo es requerido.";
                            break;
                        case "required|notDisabled":
                            if (e.target && (e.target.value == "" || e.target.value == null) && e.target.disabled == false)
                                error += "El campo es requerido.";
                            break;
                        case "sometimes|required":
                            if (e.target.value === "" || e.target.value === null || !e.target.value)
                                error += "El campo es requerido.";
                            break;
                        default:
                            break;
                    }
                })
            if (isEmpty(error))
                error = true;
            let validations = clone(validator);
            validations.getValidations()[id] = error;
            setValidator(validations);
        };
    }

    //State
    const [validator, setValidator] = useState(new Validator(rulez));

    /**
     * Calcula validez de un campo ante un evento
     * @param e
     */
    const validate = (e) => {
        let id = e.target.id ? e.target.id : e.target.name;
        let validation = rulez[id];
        let error = "";
        if (validation)
            validation.forEach((itemValidation) => {
                switch (itemValidation) {
                    case "required":
                        if (e.target.value === "" || e.target.value === null || !e.target.value)
                            error += "El campo es requerido.";
                        break;
                    case "sometimes|required":
                        if (e.target.value === "" || e.target.value === null || !e.target.value)
                            error += "El campo es requerido.";
                        break;
                    case "required|notDisabled":
                        if (e.target && (e.target.value == "" || e.target.value == null) && e.target.disabled == false)
                            error += "El campo es requerido.";
                        break;
                    default:
                        break;
                }
            })
        if (isEmpty(error))
            error = true;
        let validations = clone(validator);
        validations.getValidations()[id] = error;
        setValidator(validations);
    };

    return [validator, validate]
}
