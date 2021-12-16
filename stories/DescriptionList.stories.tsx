import React from 'react';
import { DescriptionList } from 'components/DescriptionList';

export default {
  title: 'components/DescriptionList',
  component: DescriptionList,
};

export const List = () => (
  <DescriptionList>
    <dt>Beast of Bodmin</dt>
    <dd>A large feline inhabiting Bodmin Moor.</dd>

    <dt>Morgawr</dt>
    <dd>A sea serpent.</dd>

    <dt>Owlman</dt>
    <dd>A giant owl-like creature.</dd>
  </DescriptionList>
);