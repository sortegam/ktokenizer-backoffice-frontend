<template>
  <section>
    <b-row align-v="start" class="mb-3">
      <b-col class="text-left">
        <h3>Token Operations</h3>
      </b-col>
      <b-col>
        <b-form inline class="date-filter">
          <DatePicker
            v-model="filter.dateRange"
            range
            lang="en"
            confirm
            :disabled="isLoading"
            placeholder="Filter by date"
            :not-after="new Date()"
            confirm-text="Apply"
            :shortcuts="datePickerShortcuts"
            @confirm="refresh"
            @clear="refresh"
          />
        </b-form>
      </b-col>
      <b-col>
        <b-form inline class="controls-box">
          <b-button variant="dark" @click.stop="refresh" size="sm" :disabled="isLoading">
            <span class="icon-refresh icon-large"  v-if="!isLoading"></span>
            <SimpleSpinner size="16" :line-size="2" v-if="isLoading" />
          </b-button>
          <div class="mr-4">
            <b-form-select v-model="filter.limit" :options="limitOptions" class="m-sm-2" size="sm" :disabled="isLoading" />
            entries
          </div>
          <b-button-group size="sm">
            <b-button :disabled="!existsPreviousPage || isLoading" size="sm" variant="dark" @click.stop="previousPage">
              « Previous
            </b-button>
            <b-button :disabled="isLastPage || isLoading" size="sm" variant="dark" @click.stop="nextPage" class="border-left-gray">
              Next »
            </b-button>
          </b-button-group>
        </b-form>
      </b-col>
    </b-row>
    <b-alert v-cloak show v-if="requestData.Items.length === 0 && !isLoading" variant="info">There is no token operations to show.</b-alert>
    <b-table v-if="requestData.Items.length > 0" hover :small="true" :fields="tableFieldsDefinition" :items="requestData.Items">
      <template slot="operationId" slot-scope="row">
        <strong class="cursor-pointer" @click.stop="row.toggleDetails">{{row.item.operationId}}</strong>
      </template>
      <template slot="currentStatus" slot-scope="row">
        <b-badge class="OperationBadge-row" :variant="getStatusBadgeVariant(row.item.currentStatus)">{{row.item.currentStatus}}</b-badge>
      </template>
      <template slot="actions" slot-scope="row">
        <!-- we use @click.stop here to prevent emitting of a 'row-clicked' event  -->
        <b-button size="sm" variant="secondary" @click.stop="row.toggleDetails" class="mr-2">
        {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
        </b-button>
      </template>
      <!-- ROW DETAILS -->
      <template slot="row-details" slot-scope="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Operation ID:</b></b-col>
            <b-col><strong>{{ row.item.operationId }}</strong></b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Created At:</b></b-col>
            <b-col>{{ getFormattedDateTime(row.item.createdAt) }}</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Operation Type:</b></b-col>
            <b-col>{{ row.item.type }}</b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Current Status:</b></b-col>
            <b-col><b-badge class="OperationBadge-details" :variant="getStatusBadgeVariant(row.item.currentStatus)">{{row.item.currentStatus}}</b-badge></b-col>
          </b-row>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"><b>Request IP Address:</b></b-col>
            <b-col>{{ row.item.requestIPAddress }}</b-col>
          </b-row>
          <b-row class="mb-2" v-if="row.item.historicStatus.length > 0">
            <b-col sm="3" class="text-sm-right"><b>Historic Status:</b></b-col>
            <b-col>
              <b-row class="historic-status-row" v-for="historicItem in row.item.historicStatus" :key="historicItem">
                <b-col cols="4">
                  {{ getFormattedDateTimeWithMs(historicItem.changedAt) }}
                </b-col>
                <b-col cols="1">
                  <b-badge class="OperationBadge-details small float-right" :variant="getStatusBadgeVariant(historicItem.status)">{{historicItem.status}}</b-badge>
                </b-col>
                <b-col cols="auto" >
                  {{historicItem.statusText}}
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </template>
    </b-table>
  </section>
</template>

<script>
import axios from 'axios';
import qs from 'query-string';
import _isEmpty from 'lodash/isEmpty';
import _clone from 'lodash/clone';
import SimpleSpinner from 'vue-simple-spinner';
import { API_HOST } from '@/config';
import { dateTimeFormat, dateTimeMsFormat } from '@/utils/dateTime';
import DatePicker from 'vue2-datepicker';
import * as OPERATION_STATUSES from '../constants/operationStatuses';
import startOfDay from 'date-fns/start_of_day';
import endOfDay from 'date-fns/end_of_day';
import substractDays from 'date-fns/sub_days';
import startOfMonth from 'date-fns/start_of_month';
import endOfMonth from 'date-fns/end_of_month';

export default {
  components: {
    SimpleSpinner,
    DatePicker,
  },
  computed: {
    datePickerShortcuts() {
      return [
        {
          text: 'Today',
          start: new Date(),
          end: new Date(),
        },
        {
          text: 'Yesterday',
          start: substractDays(new Date(), 1),
          end: substractDays(new Date(), 1),
        },
        {
          text: 'Last 7 days',
          start: substractDays(new Date(), 7),
          end: new Date(),
        },
        {
          text: 'Last 30 days',
          start: substractDays(new Date(), 30),
          end: new Date(),
        },
        {
          text: 'This month',
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date()),
        },
      ];
    },
    isLastPage: {
      cache: false,
      get() {
        return _isEmpty(this.requestData.LastEvaluatedKey);
      }
    },
    existsPreviousPage: {
      cache: false,
      get() {
        return (this.previousPointersBuffer.length > 0);
      }
    },
  },
  methods: {
    refresh() {
      this.fetchOperations();
    },
    nextPage() {
      try {
        this.nextItemPointer = this.requestData.Items.slice(-1)[0];
        this.previousPointersBuffer.push(_clone(this.nextItemPointer));
      } catch (e) {
        this.nextItemPointer = null;
      } finally {
        this.fetchOperations();
      }
    },
    previousPage() {
      try {
        // We need to take the cursor from the proper queue
        this.previousPointersBuffer.pop();
        this.nextItemPointer = this.previousPointersBuffer.slice(-1)[0];
      } catch (e) {
        this.nextItemPointer = null;
      } finally {
        this.fetchOperations();
      }
    },
    getFormattedDateTime(strDate) {
      return dateTimeFormat(strDate);
    },
    getFormattedDateTimeWithMs(strDate) {
      return dateTimeMsFormat(strDate);
    },
    getStatusBadgeVariant(status) {
      switch(status) {
        case OPERATION_STATUSES.REQUESTED: return 'primary';
        case OPERATION_STATUSES.FAILED: return 'danger';
        case OPERATION_STATUSES.SUCCESS: return 'success';
        default: return 'light';
      }
    },
    async fetchOperations() {
      this.isLoading = true;
      // Build API Url to call on the fly
      const params = {
        limit: this.filter.limit,
      };
      if (this.filter.dateRange[0]) {
        params.dateFrom = startOfDay(this.filter.dateRange[0]).toISOString();
      }
      if (this.filter.dateRange[1]) {
        params.dateTo = endOfDay(this.filter.dateRange[1]).toISOString();
      }
      if (!_isEmpty(this.nextItemPointer)) {
        params.startingAfter = JSON.stringify(this.nextItemPointer);
      }
      const apiURL = `${API_HOST}/v1/backoffice/operations?${qs.stringify(params)}`;
      axios.defaults.headers.common['Authorization'] = this.$store.getters['auth/jwtToken'];
      const operations = await axios.get(apiURL);
      this.requestData = operations.data;
      this.isLoading = false;
    }
  },
  watch: {
    'filter.limit': function() {
      this.fetchOperations();
    }
  },
  data() {
    return {
      filter: {
        limit: 20, // Used to limit the number of items per page
        dateRange: [],
      },
      isLoading: true,
      nextItemPointer: {},
      previousPointersBuffer: [],
      limitOptions: [10, 20, 50, 200],
      tableFieldsDefinition: [
        { key: 'createdAt', label: 'Date', formatter: dateTimeFormat },
        'operationId',
        'type',
        { key: 'currentStatus', label: 'Status' },
        { key: 'requestIPAddress', label: 'IP Address' },
        'actions',
      ],
      requestData: {
        Items: [],
      },
    };
  },
  async created() {
    await this.fetchOperations();
  },
};
</script>

<style scoped>
.OperationBadge-row {
  width: 100%;
  font-size: 1em;
}
.OperationBadge-details {
  width: auto;
  font-size: 1.1em;
}

.OperationBadge-details.small {
  font-size: 0.8em;
}

.cursor-pointer {
  cursor: pointer;
}

.border-left-gray {
  border-left: 1px solid #555;
}

.controls-box {
  margin-top: -10px;
  margin-bottom: 10px;
}

.icon-large {
  font-size: 1.2em;
}

.date-filter {
  margin-top: -4px;
}

.historic-status-row {
  margin-bottom: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
}

.historic-status-row:last-child {
  border-bottom: 0;
}
</style>
