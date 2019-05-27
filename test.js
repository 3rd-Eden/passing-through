import { Pass, Through, Provider, Consumer } from './index.js';
import { describe, it } from 'mocha';
import { shallow } from 'enzyme';
import assume from 'assume';
import React from 'react';

describe('passed-through', function () {
  let wrapper;
  let pass;

  describe('<Pass />', function () {
    function setup(props = {}) {
      wrapper = shallow(<Pass { ...props }><div /></Pass>);
      pass = wrapper.instance();
    }

    it('exported as function', function () {
      assume(Pass).is.a('function');
    });

    it('wraps it with a Provider', function () {
      setup();

      assume(wrapper.exists(Provider)).is.true();
    });

    it('renders the passed children', function () {
      setup();

      assume(wrapper.html()).equals('<div></div>');
    })
  });

  describe('<Through />', function () {
    function setup(props, data = {}, modify = {}) {
      wrapper = shallow(
        <Pass modify={ modify } { ...data }>
          <Through { ...props }><div/></ Through>
        </Pass>
      );
    }

    it('exported as a function', function () {
      assume(Through).is.a('function');
    });

    it('passes the props to the child component', function () {
      setup({ className: 'bar' });

      assume(wrapper.html()).equals('<div class="bar"></div>');
    });

    it('calls the modify functions with attributes', function () {
      setup({}, { className: 'red' }, {
        className: [(attributes) => {
          assume(attributes).is.a('object');
          attributes.className = 'blue';
        }]
      });

      assume(wrapper.html()).equals('<div class="blue"></div>');
    });

    it('only triggers the modifier if we have a matching property', function () {
      setup({}, { className: 'red' }, {
        another: [(attributes) => {
          throw new Error('I should never be called');
        }],
        className: [(attributes) => {
          assume(attributes).is.a('object');
          attributes.className = 'blue';
        }]
      });

      assume(wrapper.html()).equals('<div class="blue"></div>');
    });

    it('triggers all assigned modifiers for a given property', function () {
      setup({}, { className: 'red' }, {
        className: [(attributes) => {
          assume(attributes).is.a('object');
          attributes.className = 'blue';
        }, (attributes) => {
          assume(attributes.className).equals('blue');
          attributes.id = 'foo';
        }]
      });

      assume(wrapper.html()).to.contain('<div class="blue" id="foo"></div>');
    });

    it('calls all modifiers for matching props', function () {
      setup({}, { className: 'red', id: 'foo' }, {
        className: [(attributes) => {
          assume(attributes).is.a('object');
          attributes.className = 'blue';
        }],
        id: [(attributes, props) => {
          assume(attributes.className).equals('blue');
          attributes.id = props.id;
        }]
      });

      assume(wrapper.html()).to.contain('<div class="blue" id="foo"></div>');
    });

    it('receives the props as arguments', function (next) {
      const cows = { cows: 'moo' };

      setup({ className: 'red' }, cows, {
        cows: [(attributes, props) => {
          assume(attributes).is.a('object');
          assume(props).is.a('object');
          assume(props).deep.equals(cows);

          next();
        }]
      });

      assume(wrapper.html()).to.contain('<div class="red"></div>');
    });

    it('receives the child as arguments', function (next) {
      setup({}, { trigger: 'red' }, {
        trigger: [(attributes, props, child) => {
          assume(child.props).is.a('object');
          assume(child.type).equals('div');

          next();
        }]
      });

      assume(wrapper.html()).to.contain('<div></div>');
    });

    it('can change the child component', function () {
      setup({ className: 'red' }, { trigger: 'blue' }, {
        trigger: [(attributes, props, child) => {
          assume(child.props).is.a('object');
          assume(child.type).equals('div');

          return (
            <span>changed</span>
          );
        }]
      });

      assume(wrapper.html()).to.equal('<span class="red">changed</span>');
    });
  });
});
