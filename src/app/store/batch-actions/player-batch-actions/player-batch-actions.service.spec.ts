/*
 * @Date: 2020-03-14 22:16:09
 * @LastEditors: fashandian
 * @LastEditTime: 2020-05-23 18:04:46
 */

import { TestBed } from '@angular/core/testing';

import { PlayerBatchActionsService } from './player-batch-actions.service';

describe('BatchActionsService', () => {
    let service: PlayerBatchActionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlayerBatchActionsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
