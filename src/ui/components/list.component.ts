import { ChangeDetectionStrategy, Component} from '@angular/core';
import { SharedModule, TypedBaseListComponent } from '@vendure/admin-ui/core';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { GET_REFUNDS } from '../graphql';
import { GetRefundsDocument} from '../generated-types';

@Component({
    selector: 'refund-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})

export class ListComponent
    extends TypedBaseListComponent<
        typeof GetRefundsDocument,
        'refunds'
    > {
    filteredState: string | null = 'new';

    // Here we set up the filters that will be available
    // to use in the data table
    readonly filters = this.createFilterCollection()
        .addDateFilters()
        .addFilter({ name: 'state', type: { kind: 'text' }, label: 'State', filterField: 'state',})
        .addFilter({ name: 'method', type: { kind: 'text' }, label: 'Method', filterField: 'method',})
        .addFilter({ name: 'transactionId', type: { kind: 'text' }, label: 'TransactionId', filterField: 'transactionId',})
        .connectToRoute(this.route);

    // Here we set up the sorting options that will be available
    // to use in the data table
    readonly sorts = this.createSortCollection()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'id' })
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'state' })
        .addSort({ name: 'method' })
        .addSort({ name: 'transactionId' })
        .connectToRoute(this.route);

    constructor() {
        super();
        super.configure({
            document: GetRefundsDocument,
            getItems: data => data.refunds,
            setVariables: (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        // state: {
                        //     contains: this.searchTermControl.value ?? undefined,
                        // },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
            refreshListOnChanges: [this.filters.valueChanges, this.sorts.valueChanges],
        });
    }
}
