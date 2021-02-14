import { Spectator, createHostFactory } from '@ngneat/spectator';
import { IRadioGroupOption, radioGroupType } from '../settings.model';

import { RadioGroupComponent } from './radio-group.component';

describe('ColorSelectorComponent', () => {
  let spectator: Spectator<RadioGroupComponent>;
  const createHost = createHostFactory(RadioGroupComponent);

  const fontOptions: IRadioGroupOption[] = [
    {
      label: 'Aa',
      name: 'lexend',
      value: 'font_setting_1',
      checked: true,
    },
    {
      label: 'Aa',
      name: 'roboto',
      value: 'font_setting_2',
      checked: false,
    },
    {
      label: 'Aa',
      name: 'noto-sans-jp',
      value: 'font_setting_3',
      checked: false,
    },
  ];

  const colorOptions: IRadioGroupOption[] = [
    {
      name: 'red',
      value: 'color_setting_1',
      checked: false,
    },
    {
      name: 'blue',
      value: 'color_setting_2',
      checked: true,
    },
    {
      name: 'green',
      value: 'color_setting_3',
      checked: false,
    },
  ];

  it('should load font radio group', () => {
    spectator = createHost(
      ` <pomodoro-radio-group
    [type]="type"
    [options]="fontOptions"
    formControlName="font"
  ></pomodoro-radio-group>`,
      {
        hostProps: {
          type: radioGroupType.font,
          fontOptions,
        },
      }
    );

    expect(spectator.queryAll('.radio-wrapper')).toHaveLength(
      fontOptions.length
    );
    expect(spectator.queryAll('.radio-wrapper')[0]).toHaveDescendantWithText({
      selector: '.display-label',
      text: `${fontOptions[0].label}`,
    });

    expect(
      spectator.queryAll('.radio-wrapper')[0].querySelector('.radio')
    ).toHaveStyle({
      backgroundColor: '#040403',
    });
    expect(
      spectator.queryAll('.radio-wrapper')[1].querySelector('.radio')
    ).not.toHaveStyle({
      backgroundColor: '#040403',
    });
    expect(
      spectator.queryAll('.radio-wrapper')[2].querySelector('.radio')
    ).not.toHaveStyle({
      backgroundColor: '#040403',
    });
  });

  it('should load color radio group', () => {
    spectator = createHost(
      ` <pomodoro-radio-group
    [type]="type"
    [options]="colorOptions"
    formControlName="color"
  ></pomodoro-radio-group>`,
      {
        hostProps: {
          type: radioGroupType.color,
          colorOptions,
        },
      }
    );

    expect(
      spectator.queryAll('.radio-wrapper')[0].querySelector('.radio')
    ).toHaveStyle({
      backgroundColor: '#dd1155',
    });
    expect(
      spectator.queryAll('.radio-wrapper')[0].querySelector('.checkmark')
    ).toHaveStyle({
      opacity: '0',
    });

    expect(
      spectator.queryAll('.radio-wrapper')[1].querySelector('.radio')
    ).toHaveStyle({
      backgroundColor: '#ffee88',
    });
    expect(
      spectator.queryAll('.radio-wrapper')[1].querySelector('.checkmark')
    ).toHaveStyle({
      opacity: '1',
    });

    expect(
      spectator.queryAll('.radio-wrapper')[2].querySelector('.radio')
    ).toHaveStyle({
      backgroundColor: '#00cc99',
    });
    expect(
      spectator.queryAll('.radio-wrapper')[2].querySelector('.checkmark')
    ).toHaveStyle({
      opacity: '0',
    });
  });

  it('should select option', () => {
    spectator = createHost(
      ` <pomodoro-radio-group
    [type]="type"
    [options]="colorOptions"
    formControlName="color"
  ></pomodoro-radio-group>`,
      {
        hostProps: {
          type: radioGroupType.color,
          colorOptions,
        },
      }
    );

    expect(spectator.component.selected.name).toBe(colorOptions[1].name);
    spectator.click( spectator.queryAll('.radio-wrapper')[2]);
    expect(spectator.component.selected.name).toBe(colorOptions[2].name);
  });

});
