import React from 'react';

const SectionHeading = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow ? <p className="section-label">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p> : null}
    </div>
    {action}
  </div>
);

export default SectionHeading;

