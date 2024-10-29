export const filterEventsByImpact = (impact: string, eventImpact: string) => {
  switch (impact) {
    case 'High': {
      return eventImpact === 'High';
    }
    case 'Medium': {
      return eventImpact === 'High' || eventImpact === 'Medium';
    }
    case 'Low': {
      return eventImpact !== 'None';
    }
    default: {
      return false;
    }
  }
};
