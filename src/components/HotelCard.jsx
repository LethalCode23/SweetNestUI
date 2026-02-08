export const HotelCard = ({ hotel }) => {
  const { hotSec, hotName, hotDescription, hotAddress, hotCost } = hotel;

  const price = hotCost
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(hotCost / 1000)
    : '';

  const image =
    hotel.hotImgUrl
      ? `${hotel.hotImgUrl}?auto=compress&cs=tinysrgb&w=600`
      : '/hotel-placeholder.svg';

  return (
    <article className="hotel-card">
      <div className="hotel-media">
        <img
          src={image}
          alt={hotName}
          loading="lazy"
          className="hotel-img"
        />

        <button className="bookmark" aria-label="Guardar">🔖</button>

        <div className="media-overlay">
          <h4 className="hotel-name">{hotName}</h4>
          <div className="price-badge">{price}</div>
        </div>
      </div>

      <div className="hotel-body">
        {hotDescription && <p className="hotel-desc">{hotDescription}</p>}

        <div className="hotel-tags">
          <span className="tag">⭐ 4.7</span>
          <span className="tag">Nature Stay</span>
          <span className="tag">3 Day Escape</span>
        </div>

        <div className="hotel-footer">
          <div className="hotel-location">{hotAddress}</div>
          <button className="btn btn-primary">Book now</button>
        </div>
      </div>
    </article>
  );
};