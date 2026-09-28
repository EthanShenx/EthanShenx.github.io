export function PublicationLinkSwap({ imageSrc }) {
  return (
    <span className="publication-link__stack" aria-hidden="true">
      <span className="publication-link__label publication-link__label--icon">
        <img src={imageSrc} alt="" />
      </span>
      <span className="publication-link__label publication-link__label--read">
        Read
      </span>
    </span>
  );
}
