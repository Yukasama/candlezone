export const filterEventsByImpact = (impact: string, eventImpact: string) => {
  switch (impact) {
    case 'High': {
      return eventImpact === 'High';
    }
    case 'Low': {
      return eventImpact !== 'None';
    }
    case 'Medium': {
      return eventImpact === 'High' || eventImpact === 'Medium';
    }
    default: {
      return false;
    }
  }
};
