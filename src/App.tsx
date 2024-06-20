import { ButtonMobile } from '@alfalab/core-components/button/mobile';
import { CDNIcon } from '@alfalab/core-components/cdn-icon';
import { Collapse } from '@alfalab/core-components/collapse';
import { Gap } from '@alfalab/core-components/gap';
import { SliderInput, SliderInputProps } from '@alfalab/core-components/slider-input';
import { StatusBadge } from '@alfalab/core-components/status-badge';
import { Typography } from '@alfalab/core-components/typography';
import { useCallback, useState } from 'react';
import p1 from './assets/p1.png';
import { appSt } from './style.css';
import { sendDataToGA } from './utils/events';

const min = 30_000;
const max = 1_300_000;
const step = 10000;
const range: SliderInputProps['range'] = {
  min: [min],
  max: [max],
};
const pips: SliderInputProps['pips'] = {
  mode: 'values',
  values: [min, max],
  format: {
    to: (value: number) => {
      return `${value.toLocaleString('ru')} ₽`;
    },
  },
};

function calculatePayment(principal: number, interestRate: number, term: number) {
  const monthlyInterestRate = interestRate / 12;
  const exponent = Math.pow(1 + monthlyInterestRate, term);

  return (principal * monthlyInterestRate * exponent) / (exponent - 1);
}

const fromKPZN = 500_000;

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number | string>(min);
  const [expanded, setExpanded] = useState(false);

  const handleInputChange: SliderInputProps['onInputChange'] = (_, { value }) => {
    setValue(typeof value === 'string' ? Number(value.replace(/\s+/g, '')) : value);
  };

  const handleSliderChange: SliderInputProps['onSliderChange'] = ({ value }) => {
    setValue(value);
  };

  const numberValue = typeof value === 'string' ? Number(value.replace(/\s+/g, '')) : value;
  const handleBlur = () => {
    setValue(Math.max(min, Math.min(max, numberValue)));
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const submit = useCallback(() => {
    setLoading(true);
    sendDataToGA(numberValue).then(() => {
      setLoading(false);

      (window.location as unknown as string) =
        'alfabank://webFeature?type=recommendation&url=https%3A%2F%2Fclick.alfabank.ru%2Fmobile-offers%2Fweb%2FPIL%2Fcredits%2FMT?isWebView=true';
    });
  }, [numberValue]);

  const monthlyPayment = calculatePayment(numberValue, numberValue > fromKPZN ? 0.24 : 0.4, 60).toFixed(0);
  return (
    <>
      <div className={appSt.container}>
        <div className={appSt.card}>
          <img src={p1} height={184} width="100%" alt="монетки" className={appSt.img} />
          <Typography.TitleResponsive style={{ maxWidth: 288 }} font="system" tag="h1" view="medium" weight="bold">
            Гарантированный кредитный лимит
          </Typography.TitleResponsive>
          <Typography.Text style={{ maxWidth: 288, opacity: 0.5 }} tag="p" view="primary-medium" defaultMargins={false}>
            Берите деньги частями, пока не исчерпаете доступный лимит
          </Typography.Text>
        </div>
        <Gap size={16} />
        <SliderInput
          block
          value={value.toLocaleString('ru')}
          sliderValue={numberValue}
          onInputChange={handleInputChange}
          onSliderChange={handleSliderChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          range={range}
          pips={pips}
          step={step}
          size={56}
          rightAddons="₽"
          fieldClassName={appSt.slider}
          sliderClassName={appSt.slid}
        />

        {numberValue <= fromKPZN ? (
          <div className={appSt.plate({ ss: 'g' })}>
            <Typography.Text tag="p" view="primary-small" defaultMargins={false}>
              Оформим за 2 минуты
            </Typography.Text>
            <StatusBadge view="positive-checkmark" className={appSt.plateIcon({ ss: 'g' })} />
          </div>
        ) : null}

        {numberValue > fromKPZN ? (
          <div className={appSt.plate({ ss: 'y' })}>
            <Typography.Text tag="p" view="primary-small" defaultMargins={false}>
              Под залог недвижимости (парковка, гараж, коммерческая, квартира)
            </Typography.Text>
            <StatusBadge view="positive-checkmark" className={appSt.plateIcon({ ss: 'y' })} />
          </div>
        ) : null}
        <Gap size={16} />

        <div className={appSt.grid}>
          <div className={appSt.iconCard}>
            <CDNIcon name="glyph_chart-pie_m" />
          </div>
          <div>
            <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
              Возьмите нужную сумму сейчас
            </Typography.Text>
            <Typography.Text style={{ color: '#7F7F83' }} tag="p" view="primary-small" defaultMargins={false}>
              Взять деньги в пределах оставшегося лимита можно в любой момент
            </Typography.Text>
          </div>
        </div>
        <Gap size={0} />

        <div className={appSt.grid}>
          <div className={appSt.iconCard}>
            <CDNIcon name="glyph_checkmark-circle_m" />
          </div>
          <div>
            <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
              Вносите ежемесячные платежи для пополнения вашего лимита
            </Typography.Text>
            <Typography.Text style={{ color: '#7F7F83' }} tag="p" view="primary-small" defaultMargins={false}>
              С каждым платежом лимит будет вновь возрастать
            </Typography.Text>
          </div>
        </div>

        <div onClick={handleToggle} className={appSt.collapseAction}>
          <Typography.Text tag="p" view="primary-medium" defaultMargins={false}>
            Как еще увеличить лимит?
          </Typography.Text>
          <CDNIcon name="glyph_chevron-down_m" className={appSt.collapseArrow({ open: expanded })} />
        </div>

        <Collapse expanded={expanded}>
          <Typography.Text view="primary-small" tag="p" style={{ color: '#7F7F83' }}>
            Предоставьте справку о доходах или станьте зарплатным клиентом Альфа-Банка
          </Typography.Text>
          <Typography.Text view="primary-small" tag="p" style={{ color: '#7F7F83' }}>
            Тратьте от 100 000 ₽ в месяц с нашей кредитной картой
          </Typography.Text>
          <Typography.Text view="primary-small" tag="p" style={{ color: '#7F7F83' }}>
            Оформите подписку на Альфа-Жизнь
          </Typography.Text>
        </Collapse>
      </div>
      <Gap size={96} />
      <div className={appSt.bottomBtn}>
        <ButtonMobile block view="primary" className={appSt.btn} onClick={submit} loading={loading}>
          <div className={appSt.btnContainer}>
            <div>
              <Typography.TitleResponsive font="system" tag="h2" view="xsmall" weight="bold">
                {Number(monthlyPayment).toLocaleString('ru')} ₽
              </Typography.TitleResponsive>
              <Typography.Text style={{ color: '#A1A1A1' }} tag="p" view="primary-medium" defaultMargins={false}>
                Платеж в месяц
              </Typography.Text>
            </div>

            <div className={appSt.btnContainer}>
              <div>
                <Typography.TitleResponsive font="system" tag="h2" view="xsmall" weight="bold">
                  {numberValue > fromKPZN ? '19%' : '21%'}
                </Typography.TitleResponsive>
                <Typography.Text style={{ color: '#A1A1A1' }} tag="p" view="primary-medium" defaultMargins={false}>
                  Ставка
                </Typography.Text>
              </div>
              <CDNIcon name="glyph_chevron-right_m" />
            </div>
          </div>
        </ButtonMobile>
      </div>
    </>
  );
};
