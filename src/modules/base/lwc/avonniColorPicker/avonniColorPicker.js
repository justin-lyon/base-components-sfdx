import { LightningElement, api } from 'lwc';
import {
    colorType,
    generateColors,
    observePosition,
    normalizeBoolean,
    normalizeString
} from 'c/utilsPrivate';

import { classSet } from 'c/utils';
import { generateUniqueId } from 'c/utils';

const validVariants = [
    'standard',
    'label-inline',
    'label-hidden',
    'label-stacked'
];

const validTypes = ['base', 'custom', 'predefined'];

const validMenuVariants = [
    'bare',
    'container',
    'border',
    'border-filled',
    'bare-inverse',
    'border-inverse'
];

const validMenuIconSizes = ['xx-small', 'x-small', 'small', 'medium', 'large'];

const validMenuAlignments = [
    'left',
    'center',
    'right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
];

const DEFAULT_COLORS = [
    '#e3abec',
    '#c2dbf6',
    '#9fd6ff',
    '#9de7da',
    '#9df0bf',
    '#fff099',
    '#fed49a',
    '#d073df',
    '#86b9f3',
    '#5ebbff',
    '#44d8be',
    '#3be281',
    '#ffe654',
    '#ffb758',
    '#bd35bd',
    '#5778c1',
    '#5ebbff',
    '#00aea9',
    '#3bba4c',
    '#f4bc25',
    '#f99120',
    '#580d8c',
    '#001870',
    '#0a2399',
    '#097476',
    '#096a50',
    '#b67d11',
    '#b85d0d'
];

export default class AvonniColorPicker extends LightningElement {
    @api accessKey;
    @api fieldLevelHelp;
    @api label;
    @api name;
    @api menuIconName;
    @api menuLabel;
    @api colors = DEFAULT_COLORS;
    @api messageWhenBadInput = 'Please ensure value is correct';

    _value;
    _variant = 'standard';
    _type = 'base';
    _menuVariant = 'border';
    _menuIconSize = 'x-small';
    _menuAlignment = 'left';
    _disabled = false;
    _isLoading = false;
    _readOnly = false;
    _required = false;
    _hideColorInput = false;
    _menuNubbin = false;
    _opacity = false;

    _dropdownVisible = false;
    _dropdownOpened = false;
    init = false;
    showError = false;
    isDefault = true;
    newValue;

    connectedCallback() {
        this._connected = true;

        if (!this.name) {
            this.name = generateUniqueId();
        }
    }

    renderedCallback() {
        if (!this.init) {
            this.initSwatchColor();
            this.init = true;
        }
    }

    @api
    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
        this.initSwatchColor();
    }

    @api
    get variant() {
        return this._variant;
    }

    set variant(variant) {
        this._variant = normalizeString(variant, {
            fallbackValue: 'standard',
            validValues: validVariants
        });
    }

    @api
    get type() {
        return this._type;
    }

    set type(type) {
        this._type = normalizeString(type, {
            fallbackValue: 'base',
            validValues: validTypes
        });
    }

    @api
    get menuVariant() {
        return this._menuVariant;
    }

    set menuVariant(variant) {
        this._menuVariant = normalizeString(variant, {
            fallbackValue: 'border',
            validValues: validMenuVariants
        });
    }

    @api
    get menuIconSize() {
        return this._menuIconSize;
    }

    set menuIconSize(size) {
        this._menuIconSize = normalizeString(size, {
            fallbackValue: 'x-small',
            validValues: validMenuIconSizes
        });
    }

    @api
    get menuAlignment() {
        return this._menuAlignment;
    }

    set menuAlignment(value) {
        this._menuAlignment = normalizeString(value, {
            fallbackValue: 'left',
            validValues: validMenuAlignments
        });
    }

    @api
    get disabled() {
        return this._disabled;
    }

    set disabled(value) {
        this._disabled = normalizeBoolean(value);
    }

    @api
    get isLoading() {
        return this._isLoading;
    }

    set isLoading(value) {
        this._isLoading = normalizeBoolean(value);
    }

    @api
    get readOnly() {
        return this._readOnly;
    }

    set readOnly(value) {
        this._readOnly = normalizeBoolean(value);
    }

    @api
    get required() {
        return this._required;
    }

    set required(value) {
        this._required = normalizeBoolean(value);
    }

    @api
    get hideColorInput() {
        return this._hideColorInput;
    }

    set hideColorInput(value) {
        this._hideColorInput = normalizeBoolean(value);
    }

    @api
    get menuNubbin() {
        return this._menuNubbin;
    }

    set menuNubbin(value) {
        this._menuNubbin = normalizeBoolean(value);
    }

    @api
    get opacity() {
        return this._opacity;
    }

    set opacity(value) {
        this._opacity = normalizeBoolean(value);
    }

    get isBase() {
        return this.type === 'base';
    }

    get isCustom() {
        return this.type === 'custom';
    }

    get isPredefined() {
        return this.type === 'predefined';
    }

    get iconClass() {
        return this.menuLabel ? 'slds-m-left_xx-small' : '';
    }

    get showLabel() {
        return this.label || this.required;
    }

    get disabledInput() {
        return this.disabled || this.readOnly;
    }

    @api
    focus() {
        if (this._connected) {
            this.focusOnButton();
        }
    }

    dispatchChange(colors) {
        if (!this.disabled && !this.readOnly) {
            this.dispatchEvent(
                new CustomEvent('change', {
                    detail: {
                        hex: colors.hex,
                        hexa: colors.hexa,
                        rgb: colors.rgb,
                        rgba: colors.rgba,
                        alpha: colors.alpha
                    }
                })
            );
        }
    }

    initSwatchColor() {
        let element = this.template.querySelector('.slds-swatch');

        if (element) {
            element.style.background = this.value;
        }
    }

    focusOnButton() {
        this.template.querySelector('button').focus();
    }

    get computedAriaExpanded() {
        return String(this._dropdownVisible);
    }

    get computedContainerClass() {
        return classSet()
            .add({
                'slds-form-element_stacked': this.variant === 'label-stacked',
                'avonni-label-inline': this.variant === 'label-inline'
            })
            .toString();
    }

    get computedLegendClass() {
        return classSet('slds-form-element__label slds-no-flex')
            .add({
                'slds-assistive-text': this.variant === 'label-hidden'
            })
            .toString();
    }

    get computedButtonClass() {
        const isDropdownIcon = !this.computedShowDownIcon;
        const isBare =
            this.menuVariant === 'bare' || this.menuVariant === 'bare-inverse';

        const classes = classSet('slds-button');

        const useMoreContainer =
            this.menuVariant === 'container' ||
            this.menuVariant === 'bare-inverse' ||
            this.menuVariant === 'border-inverse';

        if (this.menuLabel) {
            classes.add({
                'slds-button_neutral':
                    this.menuVariant === 'border' && isDropdownIcon,
                'slds-button_inverse': this.menuVariant === 'border-inverse'
            });
        } else {
            classes.add({
                'slds-button_icon': !isDropdownIcon,
                'slds-button_icon-bare': isBare,
                'slds-button_icon-more': !useMoreContainer && !isDropdownIcon,
                'slds-button_icon-container-more':
                    useMoreContainer && !isDropdownIcon,
                'slds-button_icon-container':
                    this.menuVariant === 'container' && isDropdownIcon,
                'slds-button_icon-border':
                    this.menuVariant === 'border' && isDropdownIcon,
                'slds-button_icon-border-filled':
                    this.menuVariant === 'border-filled',
                'slds-button_icon-border-inverse':
                    this.menuVariant === 'border-inverse',
                'slds-button_icon-inverse': this.menuVariant === 'bare-inverse',
                'slds-button_icon-xx-small':
                    this.menuIconSize === 'xx-small' &&
                    !isBare &&
                    this.menuLabel,
                'slds-button_icon-x-small':
                    this.menuIconSize === 'x-small' &&
                    !isBare &&
                    this.menuLabel,
                'slds-button_icon-small':
                    this.menuIconSize === 'small' && !isBare && this.menuLabel,
                'slds-icon_large':
                    this.menuIconSize === 'large' && this.menuIconName
            });
        }

        return classes.toString();
    }

    get computedShowDownIcon() {
        return !(
            this.menuIconName === 'utility:down' ||
            this.menuIconName === 'utility:chevrondown'
        );
    }

    get computedDropdownClass() {
        return classSet('slds-color-picker__selector slds-dropdown')
            .add({
                'slds-dropdown_left':
                    this.menuAlignment === 'left' || this.isAutoAlignment(),
                'slds-dropdown_center': this.menuAlignment === 'center',
                'slds-dropdown_right': this.menuAlignment === 'right',
                'slds-dropdown_bottom': this.menuAlignment === 'bottom-center',
                'slds-dropdown_bottom slds-dropdown_right slds-dropdown_bottom-right':
                    this.menuAlignment === 'bottom-right',
                'slds-dropdown_bottom slds-dropdown_left slds-dropdown_bottom-left':
                    this.menuAlignment === 'bottom-left',
                'slds-nubbin_top-left':
                    this.menuNubbin && this.menuAlignment === 'left',
                'slds-nubbin_top-right':
                    this.menuNubbin && this.menuAlignment === 'right',
                'slds-nubbin_top':
                    this.menuNubbin && this.menuAlignment === 'center',
                'slds-nubbin_bottom-left':
                    this.menuNubbin && this.menuAlignment === 'bottom-left',
                'slds-nubbin_bottom-right':
                    this.menuNubbin && this.menuAlignment === 'bottom-right',
                'slds-nubbin_bottom':
                    this.menuNubbin && this.menuAlignment === 'bottom-center',
                'slds-p-vertical_large': this.isLoading
            })
            .toString();
    }

    isAutoAlignment() {
        return this.menuAlignment.startsWith('auto');
    }

    handlerChange(event) {
        if (event.detail) {
            this.newValue =
                this.opacity && Number(event.detail.alpha) < 1
                    ? event.detail.hexa
                    : event.detail.hex;
        }
    }

    handlerDone() {
        if (!this.readOnly && this.newValue) {
            this.value = this.newValue;
            this.newValue = '';

            if (this.showError) {
                this.showError = false;
                this.template
                    .querySelector('lightning-input')
                    .classList.remove('slds-has-error');
            }

            if (!this.menuIconName) {
                this.template.querySelector(
                    '.slds-swatch'
                ).style.background = this.value;
            }

            let gradientPalette = this.template.querySelector(
                '[data-name="colorGradient"]'
            );

            if (gradientPalette) {
                gradientPalette.renderValue(this.value);
            }

            this.dispatchChange(generateColors(this.value));
        }

        this.handleBlur();
    }

    handlerCancel() {
        this.newValue = '';

        let gradientPalette = this.template.querySelector(
            '[data-name="colorGradient"]'
        );

        if (gradientPalette) {
            gradientPalette.renderValue(this.value);
        }

        this.handleBlur();
    }

    handleButtonClick() {
        this.allowBlur();
        this.toggleMenuVisibility();
        this.focus();
    }

    handleButtonMouseDown(event) {
        const mainButton = 0;
        if (event.button === mainButton) {
            this.cancelBlur();
        }
    }

    handleDropdownMouseDown(event) {
        const mainButton = 0;
        if (event.button === mainButton) {
            this.cancelBlur();
        }
    }

    handleDropdownMouseUp() {
        this.allowBlur();
    }

    handleDropdownMouseLeave() {
        if (!this._menuHasFocus) {
            this.close();
        }
    }

    handlerTabClick(event) {
        event.preventDefault();

        [...this.template.querySelectorAll('a')].forEach((tab) => {
            if (tab.id === event.target.id) {
                tab.parentElement.classList.add('slds-is-active');
                this.isDefault = tab.parentElement.title === 'Default';
            } else {
                tab.parentElement.classList.remove('slds-is-active');
            }
        });
    }

    allowBlur() {
        this._cancelBlur = false;
    }

    cancelBlur() {
        this._cancelBlur = true;
    }

    handleBlur() {
        if (this._cancelBlur) {
            return;
        }

        if (this._dropdownVisible) {
            this.toggleMenuVisibility();
        }
    }

    handlePrivateFocus(event) {
        event.stopPropagation();

        this.allowBlur();
        this._menuHasFocus = true;
    }

    handlePrivateBlur(event) {
        event.stopPropagation();

        this.handleBlur();
        this._menuHasFocus = false;
    }

    handleInputColor(event) {
        let color = event.target.value;

        if (
            colorType(color) === 'hex' ||
            (colorType(color) === 'hexa' && this.opacity)
        ) {
            this.showError = false;
            this.template
                .querySelector('lightning-input')
                .classList.remove('slds-has-error');

            if (!this.menuIconName) {
                this.template.querySelector(
                    '.slds-swatch'
                ).style.background = color;
            }

            this.value = color;

            let gradientPalette = this.template.querySelector(
                '[data-name="colorGradient"]'
            );

            if (gradientPalette) {
                gradientPalette.renderValue(color);
            }

            this.dispatchChange(generateColors(color));
        } else {
            this.showError = true;
            this.template
                .querySelector('lightning-input')
                .classList.add('slds-has-error');
        }

        event.stopPropagation();
    }

    toggleMenuVisibility() {
        if (!this.disabled) {
            this._dropdownVisible = !this._dropdownVisible;

            if (!this._dropdownOpened && this._dropdownVisible) {
                this._dropdownOpened = true;
            }

            if (this._dropdownVisible) {
                this._boundingRect = this.getBoundingClientRect();
                this.pollBoundingRect();
            }

            this.template
                .querySelector('.slds-dropdown-trigger')
                .classList.toggle('slds-is-open');
        }
    }

    close() {
        if (this._dropdownVisible) {
            this.toggleMenuVisibility();
        }
    }

    pollBoundingRect() {
        if (this.isAutoAlignment() && this._dropdownVisible) {
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => {
                if (this._connected) {
                    observePosition(this, 300, this._boundingRect, () => {
                        this.close();
                    });

                    this.pollBoundingRect();
                }
            }, 250);
        }
    }
}