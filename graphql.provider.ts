import { HttpLink } from 'apollo-angular/http';
import { inject, PLATFORM_ID, Provider } from '@angular/core';
import { RemoveTypenameFromVariablesLink } from '@apollo/client/link/remove-typename';

import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { isPlatformBrowser } from '@angular/common';

// const uri = 'https://barbershop-api-rjvo.onrender.com/graphql';
export const graphqlProvider = (): Provider => {
  return provideApollo(() => {
    const httpLink = inject(HttpLink);
    const platformId = inject(PLATFORM_ID);

    const uri = '/custom-graphql';
    const removeTypenameLink = new RemoveTypenameFromVariablesLink();
    return {
      link: ApolloLink.from([removeTypenameLink, httpLink.create({ uri })]),
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: 'no-cache',
        },
        mutate: {
          fetchPolicy: 'no-cache',
        },
      },
    };
  });
};
