import React, { cloneElement, Children, createContext } from 'react';
import PropTypes from 'prop-types';

/**
 * Context used to shared the data.
 *
 * @private
 */
const { Provider, Consumer } = createContext({
  passed: () => ({}),
  modify: () => ({})
});

/**
 * Pass properties through context to child components so they can change
 * props on the fly.
 *
 * @param {Object} props The properties of the component.
 * @public
 */
function Pass(props) {
  const { children, modify, ...passed } = props;

  return (
    <Provider value={{ passed, modify }}>
      { children }
    </Provider>
  );
}

/**
 * Validate that we've received all required properties in order to function.
 *
 * @type {Object}
 * @private
 */
Pass.propTypes = {
  children: PropTypes.node.isRequired,
  modify: PropTypes.object
};

/**
 * Default properties.
 *
 * @type {Object};
 */
Pass.defaultProps = {
  modify: {}
};

/**
 * Preferres the passed through properties over their own supplied properties.
 *
 * @param {Object} props The properties of the component.
 * @public
 */
function Through(props) {
  return (
    <Consumer>
      {
        ({ modify, passed }) => {
          const { children, ...attributes } = props;
          let child = Children.only(children);

          Object.keys(passed).forEach(function applyModifiers(name) {
            const modifiers = modify[name];
            if (!Array.isArray(modifiers)) return;

            modifiers.forEach(function makeitso(modifier) {
              child = modifier(attributes, passed, child) || child;
            });
          });

          return cloneElement(child, attributes);
        }
      }
    </Consumer>
  );
}

/**
 * Validate that we've received all required properties in order to function.
 *
 * @type {Object}
 * @private
 */
Through.propTypes = {
  children: PropTypes.node.isRequired
};

export {
  Pass,
  Through,
  Provider,
  Consumer
}
