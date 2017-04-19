import { Component, OnInit, OnDestroy } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { lorem } from 'faker';

import gql from 'graphql-tag';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  template: `
    <h1>Posts</h1>

    <button (click)="createRandomPost()">Push random</button>

    <ul>
      <li *ngFor="let post of posts | async">{{post.text}}</li>
    </ul>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  posts: any;
  sub: any;

  constructor(
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.posts = this.apollo.watchQuery<any>({
      query: gql`
        query {
          allPosts {
            id
            text
          }
        }
      `
    }).map(result => result.data.allPosts);

    this.apollo.subscribe({
      query: gql`
        subscription {
          Post(filter: { mutation_in: CREATED }) {
            node {
              id
              text
            }
          }
        }
      `
    }).subscribe((data) => {
      this.posts.updateQuery((prev) => {
        const allPosts = prev.allPosts || [];

        return {
          ...prev,
          allPosts: [...allPosts, data.Post.node]
        };
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.sub = undefined;
  }

  createRandomPost() {
    this.apollo.mutate({
      mutation: gql`
        mutation ($text: String!) {
          createPost(text: $text) {
            id
            text
          }
        }
      `,
      variables: { text: lorem.sentence() }
    }).toPromise();
  }
}
