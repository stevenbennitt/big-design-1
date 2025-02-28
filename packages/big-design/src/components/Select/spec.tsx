import { AddIcon } from '@bigcommerce/big-design-icons';
import { fireEvent, render } from '@testing-library/react';
import 'jest-styled-components';
import React from 'react';

import { Form } from '../Form';

import { Select } from './Select';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      return {
        // tslint:disable-next-line: no-empty
        destroy: () => {},
        // tslint:disable-next-line: no-empty
        scheduleUpdate: () => {},
      };
    }
  };
});

const onItemChange = jest.fn();

const SelectMock = (
  <Select onItemChange={onItemChange} label="Countries" placeholder="Choose country">
    <Select.Option value="us">United States</Select.Option>
    <Select.Option value="mx">Mexico</Select.Option>
    <Select.Option value="ca">Canada</Select.Option>
    <Select.Option value="en">England</Select.Option>
  </Select>
);

test('renders select combobox', () => {
  const { getByRole } = render(SelectMock);

  expect(getByRole('combobox')).toBeInTheDocument();
});

test('renders select label', () => {
  const { getByText } = render(SelectMock);

  expect(getByText('Countries')).toBeInTheDocument();
});

test('select label has id', () => {
  const { getByText } = render(SelectMock);

  expect(getByText('Countries').id).toBeDefined();
});

test('select label has for attribute', () => {
  const { getByText } = render(SelectMock);

  expect(getByText('Countries').hasAttribute('for')).toBe(true);
});

test('renders select input', () => {
  const { getByLabelText } = render(SelectMock);

  expect(getByLabelText('Countries')).toBeInTheDocument();
});

test('select input has id', () => {
  const { getByLabelText } = render(SelectMock);

  expect(getByLabelText('Countries').id).toBeDefined();
});

test('select input has placeholder text', () => {
  const { getByPlaceholderText } = render(SelectMock);

  expect(getByPlaceholderText('Choose country')).toBeDefined();
});

test('select input has aria-autocomplete', () => {
  const { getByLabelText } = render(SelectMock);

  expect(getByLabelText('Countries').getAttribute('aria-autocomplete')).toBe('list');
});

test('select input has aria-labelledby', () => {
  const { getByLabelText, getByText } = render(SelectMock);
  const input = getByLabelText('Countries');
  const label = getByText('Countries');

  expect(input.getAttribute('aria-labelledby')).toBe(label.id);
});

test('select input has aria-controls', () => {
  const { getByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  expect(input.getAttribute('aria-controls')).toBe(getByRole('listbox').id);
});

test('renders input button', () => {
  const { getByRole } = render(SelectMock);

  expect(getByRole('button'));
});

test('input button has aria-haspopup', () => {
  const { getByRole } = render(SelectMock);

  expect(getByRole('button').getAttribute('aria-haspopup')).toBe('true');
});

test('input button has aria-label', () => {
  const { getByRole } = render(SelectMock);

  expect(getByRole('button').getAttribute('aria-label')).toBe('toggle menu');
});

test('select menu opens when focused on input', () => {
  const { getByLabelText, queryByRole } = render(SelectMock);
  const input = getByLabelText('Countries');

  expect(queryByRole('listbox')).not.toBeInTheDocument();

  fireEvent.focus(input);

  expect(queryByRole('listbox')).toBeInTheDocument();
});

test('select menu opens/closes when input button is clicked', () => {
  const { getByRole, queryByRole } = render(SelectMock);
  const button = getByRole('button');

  fireEvent.click(button);
  expect(queryByRole('listbox')).toBeInTheDocument();

  fireEvent.click(button);
  expect(queryByRole('listbox')).not.toBeInTheDocument();
});

test('select has items', () => {
  const { getAllByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  expect(getAllByRole('option').length).toBe(4);
});

test('select items should have values', () => {
  const { getAllByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');
  fireEvent.focus(input);

  const options = getAllByRole('option');

  expect(options[0].getAttribute('value')).toBe('us');
  expect(options[1].getAttribute('value')).toBe('mx');
  expect(options[2].getAttribute('value')).toBe('ca');
  expect(options[3].getAttribute('value')).toBe('en');
});

test('select items should be unfiltered when opened', () => {
  const { getAllByRole, getByRole } = render(
    <Select onItemChange={onItemChange} label="Countries" placeholder="Choose country" value="mx">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );
  const button = getByRole('button');

  fireEvent.click(button);

  const options = getAllByRole('option');

  expect(options.length).toBe(4);
});

test('select item should be highlighted when opened', () => {
  const { getAllByRole, getByLabelText, getByRole } = render(
    <Select onItemChange={onItemChange} label="Countries" placeholder="Choose country" value="mx">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );
  const button = getByRole('button');
  const input = getByLabelText('Countries');

  fireEvent.click(button);

  const options = getAllByRole('option');

  expect(options[1].dataset.highlighted).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toEqual(options[1].id);
});

test('select input text should match the value selected', () => {
  const { getByLabelText, rerender } = render(
    <Select onItemChange={onItemChange} label="Countries" placeholder="Choose country" value="mx">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries');

  expect(input.getAttribute('value')).toEqual('Mexico');

  rerender(
    <Select onItemChange={onItemChange} label="Countries" placeholder="Choose country" value="ca">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  expect(input.getAttribute('value')).toEqual('Canada');
});

test('select items should be filterable', () => {
  const { getAllByRole, getAllByLabelText, getByRole } = render(SelectMock);
  const button = getByRole('button');

  fireEvent.click(button);
  fireEvent.change(getAllByLabelText('Countries')[0], { target: { value: 'm' } });

  const options = getAllByRole('option');

  expect(options.length).toBe(1);
});

test('up/down arrows should change select item selection', () => {
  const { getAllByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const options = getAllByRole('option');

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(options[0].dataset.highlighted).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toEqual(options[0].id);

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(options[1].dataset.highlighted).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toEqual(options[1].id);

  fireEvent.keyDown(input, { key: 'ArrowUp' });
  expect(options[0].dataset.highlighted).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toEqual(options[0].id);
});

test('esc should close menu', () => {
  const { getByLabelText, queryByRole } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);
  expect(queryByRole('listbox')).toBeInTheDocument();

  fireEvent.keyDown(input, { key: 'Escape' });
  expect(queryByRole('listbox')).not.toBeInTheDocument();
});

test('tab should close menu', () => {
  const { getByLabelText, queryByRole } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);
  expect(queryByRole('listbox')).toBeInTheDocument();

  fireEvent.keyDown(input, { key: 'Tab' });
  expect(queryByRole('listbox')).not.toBeInTheDocument();
});

test('home should select first select item', () => {
  const { getAllByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const options = getAllByRole('option');

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(options[2].dataset.highlighted).toBe('true');

  fireEvent.keyDown(input, { key: 'Home' });
  expect(options[0].dataset.highlighted).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toEqual(options[0].id);
});

test('end should select last select item', () => {
  const { getAllByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const options = getAllByRole('option');

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  expect(options[0].dataset.highlighted).toBe('true');

  fireEvent.keyDown(input, { key: 'End' });
  expect(options[3].dataset.highlighted).toBe('true');
  expect(input.getAttribute('aria-activedescendant')).toEqual(options[3].id);
});

test('enter should trigger onItemChange', () => {
  const { getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'Enter' });
  expect(onItemChange).toHaveBeenCalledWith('us');
});

test('space should trigger onItemChange', () => {
  const { getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.keyDown(input, { key: ' ' });
  expect(onItemChange).toHaveBeenCalledWith('mx');
});

test('clicking on select options should trigger onItemClick', () => {
  const { getAllByRole, getByLabelText } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const options = getAllByRole('option');

  fireEvent.mouseOver(options[1]);
  fireEvent.click(options[1]);
  expect(onItemChange).toHaveBeenCalledWith('mx');
});

test('clicking on disabled select options should not trigger onItemClick', () => {
  const spy = jest.fn();
  const { getAllByRole, getByLabelText } = render(
    <Select onItemChange={spy} label="Countries" placeholder="Choose country">
      <Select.Option value="us" disabled>
        United States
      </Select.Option>
      <Select.Action>Action</Select.Action>
    </Select>,
  );
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const options = getAllByRole('option');
  const item = options[0];

  fireEvent.mouseOver(item);
  fireEvent.click(item);
  expect(spy).not.toHaveBeenCalled();
});

test('select options should be highlighted when moused over', () => {
  const { getByLabelText, getAllByRole } = render(SelectMock);
  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const option = getAllByRole('option')[0];

  fireEvent.keyDown(input, { key: 'ArrowDown' });
  fireEvent.mouseOver(option);
  expect(option.dataset.highlighted).toBe('true');
});

test('select should render select action', () => {
  const { getByRole, getByText } = render(
    <Select label="Countries" onItemChange={onItemChange} placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
      <Select.Action>Action</Select.Action>
    </Select>,
  );

  const trigger = getByRole('button');

  fireEvent.click(trigger);

  expect(getByText('Action')).toBeInTheDocument();
});

test('select action should execute onActionClick function', () => {
  const onActionClick = jest.fn();
  const { getByLabelText, getByText } = render(
    <Select onActionClick={onActionClick} onItemChange={onItemChange} label="Countries" placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
      <Select.Action>Action</Select.Action>
    </Select>,
  );

  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  fireEvent.change(input, { target: { value: 'm' } });

  const action = getByText('Action');

  fireEvent.click(action);

  expect(onActionClick).toHaveBeenCalledWith('m');
});

test('select action supports icons', () => {
  const { getByLabelText, getByRole } = render(
    <Select label="Countries" onItemChange={onItemChange} placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
      <Select.Action iconLeft={<AddIcon />}>Action</Select.Action>
    </Select>,
  );

  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const select = getByRole('listbox');

  expect(select.lastChild).toMatchSnapshot();
});

test('select action supports actionTypes', () => {
  const { getByLabelText, getByRole } = render(
    <Select label="Countries" onItemChange={onItemChange} placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
      <Select.Action actionType="destructive">Action</Select.Action>
    </Select>,
  );

  const input = getByLabelText('Countries');

  fireEvent.focus(input);

  const select = getByRole('listbox');

  expect(select.lastChild).toMatchSnapshot();
});

test('select should render an error if one is provided', () => {
  const { getByText } = render(
    <Form.Group>
      <Select label="Countries" onItemChange={onItemChange} placeholder="Choose country" error="You must choose">
        <Select.Option value="us">United States</Select.Option>
        <Select.Option value="mx">Mexico</Select.Option>
        <Select.Option value="ca">Canada</Select.Option>
        <Select.Option value="en">England</Select.Option>
        <Select.Action actionType="destructive">Action</Select.Action>
      </Select>
    </Form.Group>,
  );

  expect(getByText('You must choose')).toBeInTheDocument();
});

test('select should have a required attr if set as required', () => {
  const { getByLabelText } = render(
    <Select label="Countries" onItemChange={onItemChange} placeholder="Choose country" error="Required" required>
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries');

  expect(input.getAttribute('required')).toEqual('');
});

test('select should not have a required attr if not set as required', () => {
  const { getByLabelText } = render(
    <Select label="Countries" onItemChange={onItemChange} placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries');

  expect(input.getAttribute('required')).toEqual(null);
});

test('select should have a disabled attr if set as disabled', () => {
  const { getByLabelText } = render(
    <Select onItemChange={() => null} label="Countries" value="us" disabled>
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries');

  expect(input.getAttribute('disabled')).toEqual('');
});

test('select should not have a disabled attr if not set as disabled', () => {
  const { getByLabelText } = render(
    <Select onItemChange={() => null} label="Countries" placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="ca">Canada</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries');

  expect(input.getAttribute('disabled')).toEqual(null);
});

test('should be valid if not required', () => {
  const { getByLabelText } = render(
    <Select onItemChange={() => null} label="Countries" placeholder="Choose country">
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries') as HTMLSelectElement;

  expect(input.checkValidity()).toEqual(true);
});

test('should be invalid if required and has no value', () => {
  const { getByLabelText } = render(
    <Select onItemChange={() => null} label="Countries" placeholder="Choose country" required>
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries') as HTMLSelectElement;

  expect(input.checkValidity()).toEqual(false);
});

test('should be valid if required and has a value', () => {
  const { getByLabelText } = render(
    <Select value="us" onItemChange={() => null} label="Countries" placeholder="Choose country" required>
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries') as HTMLSelectElement;

  expect(input.checkValidity()).toEqual(true);
});

test('should be invalid when it has an error', () => {
  const { getByLabelText } = render(
    <Select error="Unrelated failure" onItemChange={() => null} label="Countries" placeholder="Choose country" required>
      <Select.Option value="us">United States</Select.Option>
      <Select.Option value="mx">Mexico</Select.Option>
      <Select.Option value="en">England</Select.Option>
    </Select>,
  );

  const input = getByLabelText('Countries') as HTMLSelectElement;

  expect(input.checkValidity()).toEqual(false);

  fireEvent.change(input, { target: { value: 'us' } });

  expect(input.checkValidity()).toEqual(false);
});
