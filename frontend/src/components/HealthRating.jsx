import { useLanguage } from '../context/LanguageContext';

const HealthRating = ({ rating, showPerson = true }) => {
  const { t } = useLanguage();
  if (!rating) return null;
  const score = rating.healthScore || 0;

  const getLabel = () => {
    if (score >= 75) return { text: t('Excellent for health'), cls: 'health-great', dot: 'green' };
    if (score >= 50) return { text: t('Balanced choice'), cls: 'health-good', dot: 'gold' };
    if (score >= 25) return { text: t('Enjoy in moderation'), cls: 'health-moderate', dot: 'gold' };
    return { text: t('Limit consumption'), cls: 'health-low', dot: 'red' };
  };
  const { text, cls, dot } = getLabel();

  const bodyFill = Math.max(10, Math.min(100, score));

  const statVal = (val, cls) => <span className={`stat-value ${cls}`}>{val}</span>;

  const stat = (label, value, unit, color = '') => (
    <div className="health-stat" key={label}>
      <span className="stat-label">{t(label)}</span>
      {statVal(`${value}${unit}`, color)}
    </div>
  );

  return (
    <div className="health-rating">
      <div className="health-score-wrap">
        <div className={`health-score ${cls}`}>
          <span className="score-num">{score}</span>
          <span className="score-label">{text}</span>
        </div>
        <div className="health-bar">
          <div className="health-fill" style={{ width: `${score}%` }} />
        </div>
      </div>

      {showPerson && (
        <div className="health-person-wrap">
          <div className="health-person-silhouette">
            <svg viewBox="0 0 48 80" fill="none">
              <circle cx="24" cy="12" r="9" stroke="var(--amz-border)" strokeWidth="2" fill="var(--amz-bg)"/>
              <path d="M8 48 C8 35, 16 28, 24 28 C32 28, 40 35, 40 48 L40 60 C40 68, 32 76, 24 76 C16 76, 8 68, 8 60Z"
                stroke="var(--amz-border)" strokeWidth="2" fill="var(--amz-bg)"/>
            </svg>
            <div className="health-person-fill" style={{ height: `${bodyFill}%` }} />
          </div>
          <div className="health-person-details">
            <div className="health-person-title">
              <span>Body Health Rating</span>
              <span>{score}%</span>
            </div>
            <div className="health-person-desc">
              {score >= 75 ? t('Excellent for health')
              : score >= 50 ? t('Balanced choice')
              : score >= 25 ? t('Enjoy in moderation')
              : t('Limit consumption')}
            </div>
          </div>
        </div>
      )}

      <div className="health-stats">
        {stat('Caffeine', rating.caffeine, 'mg', rating.caffeine > 100 ? 'red' : rating.caffeine > 50 ? 'gold' : 'green')}
        {stat('Calories', rating.calories, '', rating.calories > 200 ? 'red' : rating.calories > 100 ? 'gold' : 'green')}
        {stat('Antioxidants', rating.antioxidants, '%', rating.antioxidants > 70 ? 'green' : rating.antioxidants > 40 ? 'gold' : 'red')}
        {stat('Sugar', rating.sugar || 0, 'g', (rating.sugar || 0) > 15 ? 'red' : (rating.sugar || 0) > 5 ? 'gold' : 'green')}
        {stat('Fat', rating.fat || 0, 'g', (rating.fat || 0) > 12 ? 'red' : (rating.fat || 0) > 6 ? 'gold' : 'green')}
      </div>

      {rating.summary && <p className="health-summary">{rating.summary}</p>}
    </div>
  );
};

export default HealthRating;
