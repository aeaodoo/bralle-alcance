odoo.define('qsc.customer_autocomplete_rfc', function (require) {
    const basicFields = require('web.basic_fields');
    const FieldChar = basicFields.FieldChar;
    const fieldRegistry = require('web.field_registry');
    const rpc = require('web.rpc');

    const AutocompleteRFCField = FieldChar.extend(
        {
            events: _.extend({}, FieldChar.prototype.events, {
                'onchange': '_onChange',
                'keyup': 'debouncedGetRelatedRFCs'
            }),
            init: function () {
                this._super(...arguments);
                this.rfcs = [];
                this.debouncedGetRelatedRFCs = _.debounce(this.getRelatedRFCs.bind(this), 70);
            },
            _onChange: function () {
                const self = this;
                const val = this.$el.val();
                const match = this.rfcs.find(r => r.nombre === val);
                const setInput = (name, val) => {
                    if (!val) {
                        return;
                    }
                    const input = document.querySelector(`.tab-pane.active input[name='${name}']`);
                    const widget = self.__parentedParent.allFieldWidgets[self.dataPointID].find(w => w.name === name);
                    if (input && widget) {
                        input.value = val;
                        widget._setValue(val);
                    }
                }
                if (match) {
                    this.record.data.rfc = match.rfc;
                    setInput('rfc', match.rfc);
                    this.record.data.address = match.address;
                    setInput('address', match.address);
                    this.record.data.city = match.city;
                    setInput('city', match.city);
                    this.record.data.email = match.email;
                    setInput('email', match.email);
                    this.record.data.zip = match.zip;
                    setInput('zip', match.zip);
                }
            },
            getRelatedRFCs: function () {
                const self = this;
                const nombre = this.$el.val();
                if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
                    return;
                }
                rpc.query({
                              model: 'bralle.rfc',
                              method: 'search_read',
                              domain: [['nombre', 'ilike', nombre.normalize('NFC')]]
                          })
                   .then(res => {
                       self.rfcs = res;

                       const datalist = self.initializeDatalist.apply(self);

                       if (datalist) {
                           res.forEach(o => {
                               self.addToDataList(datalist, o);
                           })
                       }
                   });
            },
            _renderEdit: function () {
                const def = this._super.apply(this, arguments);
                const datalist = this.initializeDatalist()

                this.$el.attr('list', 'autocompletable-rfcs');
                return def;
            },
            addToDataList: function (datalist, optionValue) {
                const option = document.createElement("option");
                option.value = optionValue.nombre;
                datalist.appendChild(option);
            },
            initializeDatalist: function () {
                const elt = document.querySelector("#autocompletable-rfcs");
                if (elt) {
                    elt.innerHTML = "";
                    return elt;
                }
                const datalist = document.createElement("datalist");
                datalist.id = 'autocompletable-rfcs';
                document.body.appendChild(datalist);
                return datalist;
            },
        });

    fieldRegistry.add('autocomplete-rfc-field', AutocompleteRFCField);
});