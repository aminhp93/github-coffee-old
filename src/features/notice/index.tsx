import Countdown from 'react-countdown';
import moment from 'moment';

// Random component
const Completionist = () => <span>You are good to go!</span>;

// Renderer callback with condition
const renderer = (props: any) => {
  const { days, hours, minutes, seconds, completed } = props;
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};
export default function Notice() {
  // get time at the end of the year
  const endOfYear = moment().endOf('year').format('YYYY-MM-DD HH:mm:ss');

  //   get miliseconds time at the end of the year
  const endOfYearMiliseconds = moment(endOfYear).valueOf();
  console.log(endOfYearMiliseconds);

  return (
    <div style={{ fontSize: '30px' }}>
      <Countdown date={endOfYearMiliseconds} renderer={renderer} />
    </div>
  );
}
