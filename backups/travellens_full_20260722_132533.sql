--
-- PostgreSQL database dump
--

\restrict 5Uh5Kl7teE30W60XtmhcDgi1SOMHt7Mn5nfiwrVch5Wia5LD8RviQD1PQE0GJ6y

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS pgrst_drop_watch;
DROP EVENT TRIGGER IF EXISTS pgrst_ddl_watch;
DROP EVENT TRIGGER IF EXISTS issue_pg_net_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_graphql_access;
DROP EVENT TRIGGER IF EXISTS issue_pg_cron_access;
DROP EVENT TRIGGER IF EXISTS issue_graphql_placeholder;
DROP PUBLICATION IF EXISTS supabase_realtime;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_upload_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_bucket_id_fkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY public.sepay_webhook_log DROP CONSTRAINT IF EXISTS sepay_webhook_log_payment_id_fkey;
ALTER TABLE IF EXISTS ONLY public.saved_tour DROP CONSTRAINT IF EXISTS saved_tour_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.saved_tour DROP CONSTRAINT IF EXISTS saved_tour_tour_id_fkey;
ALTER TABLE IF EXISTS ONLY public.saved_destination DROP CONSTRAINT IF EXISTS saved_destination_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.saved_destination DROP CONSTRAINT IF EXISTS saved_destination_destination_id_fkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_codes DROP CONSTRAINT IF EXISTS password_reset_codes_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.view360 DROP CONSTRAINT IF EXISTS fk_view360_location;
ALTER TABLE IF EXISTS ONLY public.view360_image DROP CONSTRAINT IF EXISTS fk_view360_image_view360;
ALTER TABLE IF EXISTS ONLY public.view360_hotspot DROP CONSTRAINT IF EXISTS fk_view360_hotspot_view360;
ALTER TABLE IF EXISTS ONLY public.view360_hotspot DROP CONSTRAINT IF EXISTS fk_view360_hotspot_target_view360;
ALTER TABLE IF EXISTS ONLY public.user_block DROP CONSTRAINT IF EXISTS fk_user_block_blocker;
ALTER TABLE IF EXISTS ONLY public.user_block DROP CONSTRAINT IF EXISTS fk_user_block_blocked;
ALTER TABLE IF EXISTS ONLY public.travel_story_view DROP CONSTRAINT IF EXISTS fk_travel_story_view_user;
ALTER TABLE IF EXISTS ONLY public.travel_story_view DROP CONSTRAINT IF EXISTS fk_travel_story_view_story;
ALTER TABLE IF EXISTS ONLY public.travel_story DROP CONSTRAINT IF EXISTS fk_travel_story_user;
ALTER TABLE IF EXISTS ONLY public.travel_post DROP CONSTRAINT IF EXISTS fk_travel_post_user;
ALTER TABLE IF EXISTS ONLY public.travel_post_share DROP CONSTRAINT IF EXISTS fk_travel_post_share_user;
ALTER TABLE IF EXISTS ONLY public.travel_post_share DROP CONSTRAINT IF EXISTS fk_travel_post_share_post;
ALTER TABLE IF EXISTS ONLY public.travel_post DROP CONSTRAINT IF EXISTS fk_travel_post_restored_by;
ALTER TABLE IF EXISTS ONLY public.travel_post_report DROP CONSTRAINT IF EXISTS fk_travel_post_report_user;
ALTER TABLE IF EXISTS ONLY public.travel_post_report DROP CONSTRAINT IF EXISTS fk_travel_post_report_reviewed_by;
ALTER TABLE IF EXISTS ONLY public.travel_post_report DROP CONSTRAINT IF EXISTS fk_travel_post_report_post;
ALTER TABLE IF EXISTS ONLY public.travel_post_photo DROP CONSTRAINT IF EXISTS fk_travel_post_photo_post;
ALTER TABLE IF EXISTS ONLY public.travel_post DROP CONSTRAINT IF EXISTS fk_travel_post_location;
ALTER TABLE IF EXISTS ONLY public.travel_post_like DROP CONSTRAINT IF EXISTS fk_travel_post_like_user;
ALTER TABLE IF EXISTS ONLY public.travel_post_like DROP CONSTRAINT IF EXISTS fk_travel_post_like_post;
ALTER TABLE IF EXISTS ONLY public.travel_post DROP CONSTRAINT IF EXISTS fk_travel_post_destination;
ALTER TABLE IF EXISTS ONLY public.travel_post DROP CONSTRAINT IF EXISTS fk_travel_post_deleted_by;
ALTER TABLE IF EXISTS ONLY public.travel_post_comment DROP CONSTRAINT IF EXISTS fk_travel_post_comment_user;
ALTER TABLE IF EXISTS ONLY public.travel_post_comment DROP CONSTRAINT IF EXISTS fk_travel_post_comment_post;
ALTER TABLE IF EXISTS ONLY public.travel_post_comment DROP CONSTRAINT IF EXISTS fk_travel_post_comment_parent;
ALTER TABLE IF EXISTS ONLY public.travel_destination DROP CONSTRAINT IF EXISTS fk_travel_destination_destination_category;
ALTER TABLE IF EXISTS ONLY public.tour DROP CONSTRAINT IF EXISTS fk_tour_tour_category;
ALTER TABLE IF EXISTS ONLY public.tour_destination DROP CONSTRAINT IF EXISTS fk_tour_destination_tour;
ALTER TABLE IF EXISTS ONLY public.tour_destination DROP CONSTRAINT IF EXISTS fk_tour_destination_destination;
ALTER TABLE IF EXISTS ONLY public.tour_content_item_link DROP CONSTRAINT IF EXISTS fk_tour_content_item_link_tour;
ALTER TABLE IF EXISTS ONLY public.tour_content_item_link DROP CONSTRAINT IF EXISTS fk_tour_content_item_link_source;
ALTER TABLE IF EXISTS ONLY public.tour_content_item_link DROP CONSTRAINT IF EXISTS fk_tour_content_item_link_item;
ALTER TABLE IF EXISTS ONLY public.revoked_tokens DROP CONSTRAINT IF EXISTS fk_revoked_tokens_user;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS fk_review_user;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS fk_review_tour;
ALTER TABLE IF EXISTS ONLY public.review_photo DROP CONSTRAINT IF EXISTS fk_review_photo_review;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS fk_review_location;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS fk_review_booking;
ALTER TABLE IF EXISTS ONLY public.refund_request DROP CONSTRAINT IF EXISTS fk_refund_request_reviewed_by;
ALTER TABLE IF EXISTS ONLY public.refund_request DROP CONSTRAINT IF EXISTS fk_refund_request_requested_by;
ALTER TABLE IF EXISTS ONLY public.refund_request DROP CONSTRAINT IF EXISTS fk_refund_request_payment;
ALTER TABLE IF EXISTS ONLY public.refund_request DROP CONSTRAINT IF EXISTS fk_refund_request_completed_by;
ALTER TABLE IF EXISTS ONLY public.refund_request DROP CONSTRAINT IF EXISTS fk_refund_request_booking;
ALTER TABLE IF EXISTS ONLY public.payment DROP CONSTRAINT IF EXISTS fk_payment_booking;
ALTER TABLE IF EXISTS ONLY public.media_file DROP CONSTRAINT IF EXISTS fk_media_file_uploaded_by;
ALTER TABLE IF EXISTS ONLY public.map DROP CONSTRAINT IF EXISTS fk_map_location;
ALTER TABLE IF EXISTS ONLY public.location DROP CONSTRAINT IF EXISTS fk_location_destination;
ALTER TABLE IF EXISTS ONLY public.group_trip_member DROP CONSTRAINT IF EXISTS fk_group_trip_member_user;
ALTER TABLE IF EXISTS ONLY public.group_trip_member DROP CONSTRAINT IF EXISTS fk_group_trip_member_trip;
ALTER TABLE IF EXISTS ONLY public.group_trip_member DROP CONSTRAINT IF EXISTS fk_group_trip_member_removed_by;
ALTER TABLE IF EXISTS ONLY public.group_trip DROP CONSTRAINT IF EXISTS fk_group_trip_leader;
ALTER TABLE IF EXISTS ONLY public.group_trip_itinerary_item DROP CONSTRAINT IF EXISTS fk_group_trip_itinerary_trip;
ALTER TABLE IF EXISTS ONLY public.group_trip_itinerary_item DROP CONSTRAINT IF EXISTS fk_group_trip_itinerary_location;
ALTER TABLE IF EXISTS ONLY public.group_trip_invite DROP CONSTRAINT IF EXISTS fk_group_trip_invite_user;
ALTER TABLE IF EXISTS ONLY public.group_trip_invite DROP CONSTRAINT IF EXISTS fk_group_trip_invite_trip;
ALTER TABLE IF EXISTS ONLY public.group_trip_invite DROP CONSTRAINT IF EXISTS fk_group_trip_invite_by;
ALTER TABLE IF EXISTS ONLY public.group_trip DROP CONSTRAINT IF EXISTS fk_group_trip_destination;
ALTER TABLE IF EXISTS ONLY public.group_trip DROP CONSTRAINT IF EXISTS fk_group_trip_created_by;
ALTER TABLE IF EXISTS ONLY public.group_trip DROP CONSTRAINT IF EXISTS fk_group_trip_booking;
ALTER TABLE IF EXISTS ONLY public.coupon DROP CONSTRAINT IF EXISTS fk_coupon_created_by;
ALTER TABLE IF EXISTS ONLY public.booking DROP CONSTRAINT IF EXISTS fk_booking_user;
ALTER TABLE IF EXISTS ONLY public.booking DROP CONSTRAINT IF EXISTS fk_booking_tour;
ALTER TABLE IF EXISTS ONLY public.booking_status_history DROP CONSTRAINT IF EXISTS fk_booking_status_history_changed_by;
ALTER TABLE IF EXISTS ONLY public.booking_status_history DROP CONSTRAINT IF EXISTS fk_booking_status_history_booking;
ALTER TABLE IF EXISTS ONLY public.booking_detail DROP CONSTRAINT IF EXISTS fk_booking_detail_booking;
ALTER TABLE IF EXISTS ONLY public.booking DROP CONSTRAINT IF EXISTS fk_booking_coupon;
ALTER TABLE IF EXISTS ONLY public.booking DROP CONSTRAINT IF EXISTS fk_booking_canceled_by;
ALTER TABLE IF EXISTS ONLY public.blog DROP CONSTRAINT IF EXISTS fk_blog_user;
ALTER TABLE IF EXISTS ONLY public.blog_location DROP CONSTRAINT IF EXISTS fk_blog_location_location;
ALTER TABLE IF EXISTS ONLY public.blog_location DROP CONSTRAINT IF EXISTS fk_blog_location_blog;
ALTER TABLE IF EXISTS ONLY public.blog_comment DROP CONSTRAINT IF EXISTS fk_blog_comment_user;
ALTER TABLE IF EXISTS ONLY public.blog_comment DROP CONSTRAINT IF EXISTS fk_blog_comment_parent;
ALTER TABLE IF EXISTS ONLY public.blog_comment DROP CONSTRAINT IF EXISTS fk_blog_comment_blog;
ALTER TABLE IF EXISTS ONLY public.blog_blog_category DROP CONSTRAINT IF EXISTS fk_blog_blog_category_category;
ALTER TABLE IF EXISTS ONLY public.blog_blog_category DROP CONSTRAINT IF EXISTS fk_blog_blog_category_blog;
ALTER TABLE IF EXISTS ONLY public.ai_chat_history DROP CONSTRAINT IF EXISTS fk_ai_chat_history_user;
ALTER TABLE IF EXISTS ONLY public.email_verification_tokens DROP CONSTRAINT IF EXISTS email_verification_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.coupon DROP CONSTRAINT IF EXISTS coupon_created_by_fkey;
ALTER TABLE IF EXISTS ONLY public.ai_search_history DROP CONSTRAINT IF EXISTS ai_search_history_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_oauth_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_flow_state_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_sso_provider_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_client_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_user_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_auth_factor_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_fkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_user_id_fkey;
DROP TRIGGER IF EXISTS update_objects_updated_at ON storage.objects;
DROP TRIGGER IF EXISTS protect_objects_delete ON storage.objects;
DROP TRIGGER IF EXISTS protect_buckets_delete ON storage.buckets;
DROP TRIGGER IF EXISTS enforce_bucket_name_length_trigger ON storage.buckets;
DROP TRIGGER IF EXISTS tr_check_filters ON realtime.subscription;
DROP INDEX IF EXISTS storage.vector_indexes_name_bucket_id_idx;
DROP INDEX IF EXISTS storage.name_prefix_search;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name_lower;
DROP INDEX IF EXISTS storage.idx_objects_bucket_id_name;
DROP INDEX IF EXISTS storage.idx_multipart_uploads_list;
DROP INDEX IF EXISTS storage.buckets_analytics_unique_name_idx;
DROP INDEX IF EXISTS storage.bucketid_objname;
DROP INDEX IF EXISTS storage.bname;
DROP INDEX IF EXISTS realtime.subscription_subscription_id_entity_filters_action_filter_selec;
DROP INDEX IF EXISTS realtime.messages_inserted_at_topic_index;
DROP INDEX IF EXISTS realtime.ix_realtime_subscription_entity;
DROP INDEX IF EXISTS public.uq_tour_slug_active;
DROP INDEX IF EXISTS public.uq_tour_content_item_type_normalized_active;
DROP INDEX IF EXISTS public.uq_review_active_booking;
DROP INDEX IF EXISTS public.uq_group_trip_pending_invite;
DROP INDEX IF EXISTS public.uq_group_trip_active_leader;
DROP INDEX IF EXISTS public.uq_coupon_active_code;
DROP INDEX IF EXISTS public.idx_view360_location_id;
DROP INDEX IF EXISTS public.idx_view360_image_view_id;
DROP INDEX IF EXISTS public.idx_view360_image_deleted_at;
DROP INDEX IF EXISTS public.idx_view360_hotspot_view360_id;
DROP INDEX IF EXISTS public.idx_view360_hotspot_target_view360_id;
DROP INDEX IF EXISTS public.idx_view360_hotspot_deleted_at;
DROP INDEX IF EXISTS public.idx_view360_deleted_at;
DROP INDEX IF EXISTS public.idx_user_block_blocked_id;
DROP INDEX IF EXISTS public.idx_travel_story_user_created;
DROP INDEX IF EXISTS public.idx_travel_story_expires_at;
DROP INDEX IF EXISTS public.idx_travel_story_active_feed;
DROP INDEX IF EXISTS public.idx_travel_post_visibility;
DROP INDEX IF EXISTS public.idx_travel_post_user_id;
DROP INDEX IF EXISTS public.idx_travel_post_status_created_at;
DROP INDEX IF EXISTS public.idx_travel_post_share_user_id;
DROP INDEX IF EXISTS public.idx_travel_post_share_recent;
DROP INDEX IF EXISTS public.idx_travel_post_share_post_id;
DROP INDEX IF EXISTS public.idx_travel_post_share_platform;
DROP INDEX IF EXISTS public.idx_travel_post_report_user_id;
DROP INDEX IF EXISTS public.idx_travel_post_report_status;
DROP INDEX IF EXISTS public.idx_travel_post_report_post_id;
DROP INDEX IF EXISTS public.idx_travel_post_photo_post_id;
DROP INDEX IF EXISTS public.idx_travel_post_photo_deleted_at;
DROP INDEX IF EXISTS public.idx_travel_post_location_id;
DROP INDEX IF EXISTS public.idx_travel_post_like_user_id;
DROP INDEX IF EXISTS public.idx_travel_post_destination_id;
DROP INDEX IF EXISTS public.idx_travel_post_deleted_at;
DROP INDEX IF EXISTS public.idx_travel_post_comment_user_id;
DROP INDEX IF EXISTS public.idx_travel_post_comment_post_id;
DROP INDEX IF EXISTS public.idx_travel_post_comment_parent_id;
DROP INDEX IF EXISTS public.idx_travel_post_comment_deleted_at;
DROP INDEX IF EXISTS public.idx_travel_destination_name_unique;
DROP INDEX IF EXISTS public.idx_travel_destination_destination_category_id;
DROP INDEX IF EXISTS public.idx_travel_destination_deleted_at;
DROP INDEX IF EXISTS public.idx_travel_destination_coordinates;
DROP INDEX IF EXISTS public.idx_tour_tour_category_id;
DROP INDEX IF EXISTS public.idx_tour_status;
DROP INDEX IF EXISTS public.idx_tour_start_at;
DROP INDEX IF EXISTS public.idx_tour_destination_tour_id;
DROP INDEX IF EXISTS public.idx_tour_destination_destination_id;
DROP INDEX IF EXISTS public.idx_tour_deleted_at;
DROP INDEX IF EXISTS public.idx_tour_created_at;
DROP INDEX IF EXISTS public.idx_tour_content_item_type_status;
DROP INDEX IF EXISTS public.idx_tour_content_item_link_source;
DROP INDEX IF EXISTS public.idx_tour_category_name_unique;
DROP INDEX IF EXISTS public.idx_sepay_webhook_log_payment_code;
DROP INDEX IF EXISTS public.idx_sepay_webhook_log_created_at;
DROP INDEX IF EXISTS public.idx_saved_tour_user_id;
DROP INDEX IF EXISTS public.idx_saved_destination_user_id;
DROP INDEX IF EXISTS public.idx_revoked_tokens_token_hash;
DROP INDEX IF EXISTS public.idx_revoked_tokens_expires_at;
DROP INDEX IF EXISTS public.idx_review_user_location_unique;
DROP INDEX IF EXISTS public.idx_review_user_id;
DROP INDEX IF EXISTS public.idx_review_tour_id;
DROP INDEX IF EXISTS public.idx_review_photo_review_id;
DROP INDEX IF EXISTS public.idx_review_photo_deleted_at;
DROP INDEX IF EXISTS public.idx_review_location_id;
DROP INDEX IF EXISTS public.idx_review_deleted_at;
DROP INDEX IF EXISTS public.idx_review_booking_id;
DROP INDEX IF EXISTS public.idx_refund_request_status;
DROP INDEX IF EXISTS public.idx_refund_request_reviewed_by;
DROP INDEX IF EXISTS public.idx_refund_request_requested_by;
DROP INDEX IF EXISTS public.idx_refund_request_payment_id;
DROP INDEX IF EXISTS public.idx_refund_request_active_booking;
DROP INDEX IF EXISTS public.idx_payment_status_expired_at;
DROP INDEX IF EXISTS public.idx_payment_sepay_transaction_unique;
DROP INDEX IF EXISTS public.idx_payment_payment_code_unique;
DROP INDEX IF EXISTS public.idx_payment_booking_id;
DROP INDEX IF EXISTS public.idx_password_reset_codes_user_id;
DROP INDEX IF EXISTS public.idx_password_reset_codes_reset_token_hash;
DROP INDEX IF EXISTS public.idx_password_reset_codes_code_hash;
DROP INDEX IF EXISTS public.idx_media_file_uploaded_by;
DROP INDEX IF EXISTS public.idx_media_file_deleted_at;
DROP INDEX IF EXISTS public.idx_media_file_created_at;
DROP INDEX IF EXISTS public.idx_map_location_id;
DROP INDEX IF EXISTS public.idx_map_is_deleted;
DROP INDEX IF EXISTS public.idx_map_deleted_at;
DROP INDEX IF EXISTS public.idx_location_destination_name_unique;
DROP INDEX IF EXISTS public.idx_location_destination_id;
DROP INDEX IF EXISTS public.idx_location_deleted_at;
DROP INDEX IF EXISTS public.idx_location_created_at;
DROP INDEX IF EXISTS public.idx_location_coordinates;
DROP INDEX IF EXISTS public.idx_group_trip_not_deleted;
DROP INDEX IF EXISTS public.idx_group_trip_member_user_status;
DROP INDEX IF EXISTS public.idx_group_trip_itinerary_trip_date;
DROP INDEX IF EXISTS public.idx_group_trip_invite_user_status;
DROP INDEX IF EXISTS public.idx_group_trip_invite_trip_status;
DROP INDEX IF EXISTS public.idx_email_verification_tokens_user_id;
DROP INDEX IF EXISTS public.idx_email_verification_tokens_token_hash;
DROP INDEX IF EXISTS public.idx_destination_category_name_unique;
DROP INDEX IF EXISTS public.idx_coupon_status;
DROP INDEX IF EXISTS public.idx_coupon_deleted_at;
DROP INDEX IF EXISTS public.idx_coupon_code;
DROP INDEX IF EXISTS public.idx_booking_user_id;
DROP INDEX IF EXISTS public.idx_booking_tour_id;
DROP INDEX IF EXISTS public.idx_booking_tour_departure_status;
DROP INDEX IF EXISTS public.idx_booking_tour_departure_at;
DROP INDEX IF EXISTS public.idx_booking_status_history_created_at;
DROP INDEX IF EXISTS public.idx_booking_status_history_booking_id;
DROP INDEX IF EXISTS public.idx_booking_status_history_action;
DROP INDEX IF EXISTS public.idx_booking_detail_booking_id;
DROP INDEX IF EXISTS public.idx_booking_departure_at;
DROP INDEX IF EXISTS public.idx_booking_created_at;
DROP INDEX IF EXISTS public.idx_booking_coupon_id;
DROP INDEX IF EXISTS public.idx_booking_canceled_by;
DROP INDEX IF EXISTS public.idx_booking_canceled_at;
DROP INDEX IF EXISTS public.idx_blog_user_id;
DROP INDEX IF EXISTS public.idx_blog_status_published_at;
DROP INDEX IF EXISTS public.idx_blog_slug_unique;
DROP INDEX IF EXISTS public.idx_blog_location_location_id;
DROP INDEX IF EXISTS public.idx_blog_location_blog_id;
DROP INDEX IF EXISTS public.idx_blog_comment_user_id;
DROP INDEX IF EXISTS public.idx_blog_comment_status;
DROP INDEX IF EXISTS public.idx_blog_comment_parent_comment_id;
DROP INDEX IF EXISTS public.idx_blog_comment_deleted_at;
DROP INDEX IF EXISTS public.idx_blog_comment_blog_id;
DROP INDEX IF EXISTS public.idx_blog_blog_category_category_id;
DROP INDEX IF EXISTS public.idx_ai_chat_history_user_id;
DROP INDEX IF EXISTS public.idx_ai_chat_history_created_at;
DROP INDEX IF EXISTS auth.webauthn_credentials_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_credentials_credential_id_key;
DROP INDEX IF EXISTS auth.webauthn_challenges_user_id_idx;
DROP INDEX IF EXISTS auth.webauthn_challenges_expires_at_idx;
DROP INDEX IF EXISTS auth.users_is_anonymous_idx;
DROP INDEX IF EXISTS auth.users_instance_id_idx;
DROP INDEX IF EXISTS auth.users_instance_id_email_idx;
DROP INDEX IF EXISTS auth.users_email_partial_key;
DROP INDEX IF EXISTS auth.user_id_created_at_idx;
DROP INDEX IF EXISTS auth.unique_phone_factor_per_user;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_pattern_idx;
DROP INDEX IF EXISTS auth.sso_providers_resource_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.sso_domains_domain_idx;
DROP INDEX IF EXISTS auth.sessions_user_id_idx;
DROP INDEX IF EXISTS auth.sessions_oauth_client_id_idx;
DROP INDEX IF EXISTS auth.sessions_not_after_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_for_email_idx;
DROP INDEX IF EXISTS auth.saml_relay_states_created_at_idx;
DROP INDEX IF EXISTS auth.saml_providers_sso_provider_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_updated_at_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_session_id_revoked_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_parent_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_user_id_idx;
DROP INDEX IF EXISTS auth.refresh_tokens_instance_id_idx;
DROP INDEX IF EXISTS auth.recovery_token_idx;
DROP INDEX IF EXISTS auth.reauthentication_token_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_user_id_token_type_key;
DROP INDEX IF EXISTS auth.one_time_tokens_token_hash_hash_idx;
DROP INDEX IF EXISTS auth.one_time_tokens_relates_to_hash_idx;
DROP INDEX IF EXISTS auth.oauth_consents_user_order_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_user_client_idx;
DROP INDEX IF EXISTS auth.oauth_consents_active_client_idx;
DROP INDEX IF EXISTS auth.oauth_clients_deleted_at_idx;
DROP INDEX IF EXISTS auth.oauth_auth_pending_exp_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_id_idx;
DROP INDEX IF EXISTS auth.mfa_factors_user_friendly_name_unique;
DROP INDEX IF EXISTS auth.mfa_challenge_created_at_idx;
DROP INDEX IF EXISTS auth.idx_users_name;
DROP INDEX IF EXISTS auth.idx_users_last_sign_in_at_desc;
DROP INDEX IF EXISTS auth.idx_users_email;
DROP INDEX IF EXISTS auth.idx_users_created_at_desc;
DROP INDEX IF EXISTS auth.idx_user_id_auth_method;
DROP INDEX IF EXISTS auth.idx_oauth_client_states_created_at;
DROP INDEX IF EXISTS auth.idx_auth_code;
DROP INDEX IF EXISTS auth.identities_user_id_idx;
DROP INDEX IF EXISTS auth.identities_email_idx;
DROP INDEX IF EXISTS auth.flow_state_created_at_idx;
DROP INDEX IF EXISTS auth.factor_id_created_at_idx;
DROP INDEX IF EXISTS auth.email_change_token_new_idx;
DROP INDEX IF EXISTS auth.email_change_token_current_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_provider_type_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_identifier_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_enabled_idx;
DROP INDEX IF EXISTS auth.custom_oauth_providers_created_at_idx;
DROP INDEX IF EXISTS auth.confirmation_token_idx;
DROP INDEX IF EXISTS auth.audit_logs_instance_id_idx;
ALTER TABLE IF EXISTS ONLY storage.vector_indexes DROP CONSTRAINT IF EXISTS vector_indexes_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads DROP CONSTRAINT IF EXISTS s3_multipart_uploads_pkey;
ALTER TABLE IF EXISTS ONLY storage.s3_multipart_uploads_parts DROP CONSTRAINT IF EXISTS s3_multipart_uploads_parts_pkey;
ALTER TABLE IF EXISTS ONLY storage.objects DROP CONSTRAINT IF EXISTS objects_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_pkey;
ALTER TABLE IF EXISTS ONLY storage.migrations DROP CONSTRAINT IF EXISTS migrations_name_key;
ALTER TABLE IF EXISTS ONLY storage.buckets_vectors DROP CONSTRAINT IF EXISTS buckets_vectors_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets DROP CONSTRAINT IF EXISTS buckets_pkey;
ALTER TABLE IF EXISTS ONLY storage.buckets_analytics DROP CONSTRAINT IF EXISTS buckets_analytics_pkey;
ALTER TABLE IF EXISTS ONLY realtime.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY realtime.subscription DROP CONSTRAINT IF EXISTS pk_subscription;
ALTER TABLE IF EXISTS ONLY realtime.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS realtime.messages DROP CONSTRAINT IF EXISTS messages_payload_exclusive;
ALTER TABLE IF EXISTS ONLY public.view360 DROP CONSTRAINT IF EXISTS view360_pkey;
ALTER TABLE IF EXISTS ONLY public.view360_image DROP CONSTRAINT IF EXISTS view360_image_pkey;
ALTER TABLE IF EXISTS ONLY public.view360_hotspot DROP CONSTRAINT IF EXISTS view360_hotspot_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.user_block DROP CONSTRAINT IF EXISTS user_block_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post_report DROP CONSTRAINT IF EXISTS uq_travel_post_report_user_post;
ALTER TABLE IF EXISTS ONLY public.tour_destination DROP CONSTRAINT IF EXISTS uq_tour_destination_order;
ALTER TABLE IF EXISTS ONLY public.tour_destination DROP CONSTRAINT IF EXISTS uq_tour_destination_destination;
ALTER TABLE IF EXISTS ONLY public.tour_content_item_link DROP CONSTRAINT IF EXISTS uq_tour_content_item_link_item;
ALTER TABLE IF EXISTS ONLY public.group_trip_member DROP CONSTRAINT IF EXISTS uq_group_trip_member_user;
ALTER TABLE IF EXISTS ONLY public.blog_category DROP CONSTRAINT IF EXISTS uq_blog_category_name;
ALTER TABLE IF EXISTS ONLY public.travel_story DROP CONSTRAINT IF EXISTS travel_story_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post_share DROP CONSTRAINT IF EXISTS travel_post_share_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post_report DROP CONSTRAINT IF EXISTS travel_post_report_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post DROP CONSTRAINT IF EXISTS travel_post_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post_photo DROP CONSTRAINT IF EXISTS travel_post_photo_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post_like DROP CONSTRAINT IF EXISTS travel_post_like_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_post_comment DROP CONSTRAINT IF EXISTS travel_post_comment_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_destination DROP CONSTRAINT IF EXISTS travel_destination_pkey;
ALTER TABLE IF EXISTS ONLY public.tour DROP CONSTRAINT IF EXISTS tour_pkey;
ALTER TABLE IF EXISTS ONLY public.tour_destination DROP CONSTRAINT IF EXISTS tour_destination_pkey;
ALTER TABLE IF EXISTS ONLY public.tour_content_item DROP CONSTRAINT IF EXISTS tour_content_item_pkey;
ALTER TABLE IF EXISTS ONLY public.tour_category DROP CONSTRAINT IF EXISTS tour_category_pkey;
ALTER TABLE IF EXISTS ONLY public.statistics DROP CONSTRAINT IF EXISTS statistics_pkey;
ALTER TABLE IF EXISTS ONLY public.sepay_webhook_log DROP CONSTRAINT IF EXISTS sepay_webhook_log_sepay_transaction_id_key;
ALTER TABLE IF EXISTS ONLY public.sepay_webhook_log DROP CONSTRAINT IF EXISTS sepay_webhook_log_pkey;
ALTER TABLE IF EXISTS ONLY public.saved_tour DROP CONSTRAINT IF EXISTS saved_tour_pkey;
ALTER TABLE IF EXISTS ONLY public.saved_destination DROP CONSTRAINT IF EXISTS saved_destination_pkey;
ALTER TABLE IF EXISTS ONLY public.revoked_tokens DROP CONSTRAINT IF EXISTS revoked_tokens_token_hash_key;
ALTER TABLE IF EXISTS ONLY public.revoked_tokens DROP CONSTRAINT IF EXISTS revoked_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.review DROP CONSTRAINT IF EXISTS review_pkey;
ALTER TABLE IF EXISTS ONLY public.review_photo DROP CONSTRAINT IF EXISTS review_photo_pkey;
ALTER TABLE IF EXISTS ONLY public.refund_request DROP CONSTRAINT IF EXISTS refund_request_pkey;
ALTER TABLE IF EXISTS ONLY public.travel_story_view DROP CONSTRAINT IF EXISTS pk_travel_story_view;
ALTER TABLE IF EXISTS ONLY public.tour_content_item_link DROP CONSTRAINT IF EXISTS pk_tour_content_item_link;
ALTER TABLE IF EXISTS ONLY public.payment DROP CONSTRAINT IF EXISTS payment_pkey;
ALTER TABLE IF EXISTS ONLY public.password_reset_codes DROP CONSTRAINT IF EXISTS password_reset_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.media_file DROP CONSTRAINT IF EXISTS media_file_pkey;
ALTER TABLE IF EXISTS ONLY public.media_file DROP CONSTRAINT IF EXISTS media_file_file_url_key;
ALTER TABLE IF EXISTS ONLY public.map DROP CONSTRAINT IF EXISTS map_pkey;
ALTER TABLE IF EXISTS ONLY public.location DROP CONSTRAINT IF EXISTS location_pkey;
ALTER TABLE IF EXISTS ONLY public.group_trip DROP CONSTRAINT IF EXISTS group_trip_pkey;
ALTER TABLE IF EXISTS ONLY public.group_trip_member DROP CONSTRAINT IF EXISTS group_trip_member_pkey;
ALTER TABLE IF EXISTS ONLY public.group_trip_itinerary_item DROP CONSTRAINT IF EXISTS group_trip_itinerary_item_pkey;
ALTER TABLE IF EXISTS ONLY public.group_trip_invite DROP CONSTRAINT IF EXISTS group_trip_invite_token_hash_key;
ALTER TABLE IF EXISTS ONLY public.group_trip_invite DROP CONSTRAINT IF EXISTS group_trip_invite_pkey;
ALTER TABLE IF EXISTS ONLY public.email_verification_tokens DROP CONSTRAINT IF EXISTS email_verification_tokens_token_hash_key;
ALTER TABLE IF EXISTS ONLY public.email_verification_tokens DROP CONSTRAINT IF EXISTS email_verification_tokens_pkey;
ALTER TABLE IF EXISTS ONLY public.destination_category DROP CONSTRAINT IF EXISTS destination_category_pkey;
ALTER TABLE IF EXISTS ONLY public.coupon DROP CONSTRAINT IF EXISTS coupon_pkey;
ALTER TABLE IF EXISTS ONLY public.booking_status_history DROP CONSTRAINT IF EXISTS booking_status_history_pkey;
ALTER TABLE IF EXISTS ONLY public.booking DROP CONSTRAINT IF EXISTS booking_pkey;
ALTER TABLE IF EXISTS ONLY public.booking_detail DROP CONSTRAINT IF EXISTS booking_detail_pkey;
ALTER TABLE IF EXISTS ONLY public.blog DROP CONSTRAINT IF EXISTS blog_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_location DROP CONSTRAINT IF EXISTS blog_location_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_comment DROP CONSTRAINT IF EXISTS blog_comment_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_category DROP CONSTRAINT IF EXISTS blog_category_pkey;
ALTER TABLE IF EXISTS ONLY public.blog_blog_category DROP CONSTRAINT IF EXISTS blog_blog_category_pkey;
ALTER TABLE IF EXISTS ONLY public.ai_search_history DROP CONSTRAINT IF EXISTS ai_search_history_pkey;
ALTER TABLE IF EXISTS ONLY public.ai_chat_history DROP CONSTRAINT IF EXISTS ai_chat_history_pkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_credentials DROP CONSTRAINT IF EXISTS webauthn_credentials_pkey;
ALTER TABLE IF EXISTS ONLY auth.webauthn_challenges DROP CONSTRAINT IF EXISTS webauthn_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY auth.users DROP CONSTRAINT IF EXISTS users_phone_key;
ALTER TABLE IF EXISTS ONLY auth.sso_providers DROP CONSTRAINT IF EXISTS sso_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.sso_domains DROP CONSTRAINT IF EXISTS sso_domains_pkey;
ALTER TABLE IF EXISTS ONLY auth.sessions DROP CONSTRAINT IF EXISTS sessions_pkey;
ALTER TABLE IF EXISTS ONLY auth.schema_migrations DROP CONSTRAINT IF EXISTS schema_migrations_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_relay_states DROP CONSTRAINT IF EXISTS saml_relay_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.saml_providers DROP CONSTRAINT IF EXISTS saml_providers_entity_id_key;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_token_unique;
ALTER TABLE IF EXISTS ONLY auth.refresh_tokens DROP CONSTRAINT IF EXISTS refresh_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.one_time_tokens DROP CONSTRAINT IF EXISTS one_time_tokens_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_user_client_unique;
ALTER TABLE IF EXISTS ONLY auth.oauth_consents DROP CONSTRAINT IF EXISTS oauth_consents_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_clients DROP CONSTRAINT IF EXISTS oauth_clients_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_client_states DROP CONSTRAINT IF EXISTS oauth_client_states_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_pkey;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_id_key;
ALTER TABLE IF EXISTS ONLY auth.oauth_authorizations DROP CONSTRAINT IF EXISTS oauth_authorizations_authorization_code_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_factors DROP CONSTRAINT IF EXISTS mfa_factors_last_challenged_at_key;
ALTER TABLE IF EXISTS ONLY auth.mfa_challenges DROP CONSTRAINT IF EXISTS mfa_challenges_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS mfa_amr_claims_session_id_authentication_method_pkey;
ALTER TABLE IF EXISTS ONLY auth.instances DROP CONSTRAINT IF EXISTS instances_pkey;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_provider_id_provider_unique;
ALTER TABLE IF EXISTS ONLY auth.identities DROP CONSTRAINT IF EXISTS identities_pkey;
ALTER TABLE IF EXISTS ONLY auth.flow_state DROP CONSTRAINT IF EXISTS flow_state_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_pkey;
ALTER TABLE IF EXISTS ONLY auth.custom_oauth_providers DROP CONSTRAINT IF EXISTS custom_oauth_providers_identifier_key;
ALTER TABLE IF EXISTS ONLY auth.audit_log_entries DROP CONSTRAINT IF EXISTS audit_log_entries_pkey;
ALTER TABLE IF EXISTS ONLY auth.mfa_amr_claims DROP CONSTRAINT IF EXISTS amr_id_pk;
ALTER TABLE IF EXISTS public.view360_image ALTER COLUMN image_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.view360_hotspot ALTER COLUMN hotspot_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.view360 ALTER COLUMN view_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_story ALTER COLUMN story_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_post_share ALTER COLUMN share_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_post_report ALTER COLUMN report_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_post_photo ALTER COLUMN photo_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_post_comment ALTER COLUMN comment_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_post ALTER COLUMN post_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.travel_destination ALTER COLUMN destination_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tour_destination ALTER COLUMN tour_destination_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tour_content_item ALTER COLUMN content_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tour_category ALTER COLUMN tour_category_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tour ALTER COLUMN tour_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.statistics ALTER COLUMN stat_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sepay_webhook_log ALTER COLUMN sepay_webhook_log_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.revoked_tokens ALTER COLUMN revoked_token_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.review_photo ALTER COLUMN photo_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.review ALTER COLUMN review_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.refund_request ALTER COLUMN refund_request_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.payment ALTER COLUMN payment_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.password_reset_codes ALTER COLUMN reset_code_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.media_file ALTER COLUMN media_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.map ALTER COLUMN map_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.location ALTER COLUMN location_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.group_trip_member ALTER COLUMN group_trip_member_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.group_trip_itinerary_item ALTER COLUMN itinerary_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.group_trip_invite ALTER COLUMN group_trip_invite_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.group_trip ALTER COLUMN group_trip_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.email_verification_tokens ALTER COLUMN verification_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.destination_category ALTER COLUMN destination_category_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.coupon ALTER COLUMN coupon_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.booking_status_history ALTER COLUMN booking_status_history_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.booking_detail ALTER COLUMN booking_detail_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.booking ALTER COLUMN booking_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog_comment ALTER COLUMN comment_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog_category ALTER COLUMN blog_category_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.blog ALTER COLUMN blog_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ai_search_history ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.ai_chat_history ALTER COLUMN chat_id DROP DEFAULT;
ALTER TABLE IF EXISTS auth.refresh_tokens ALTER COLUMN id DROP DEFAULT;
DROP TABLE IF EXISTS storage.vector_indexes;
DROP TABLE IF EXISTS storage.s3_multipart_uploads_parts;
DROP TABLE IF EXISTS storage.s3_multipart_uploads;
DROP TABLE IF EXISTS storage.objects;
DROP TABLE IF EXISTS storage.migrations;
DROP TABLE IF EXISTS storage.buckets_vectors;
DROP TABLE IF EXISTS storage.buckets_analytics;
DROP TABLE IF EXISTS storage.buckets;
DROP TABLE IF EXISTS realtime.subscription;
DROP TABLE IF EXISTS realtime.schema_migrations;
DROP TABLE IF EXISTS realtime.messages;
DROP SEQUENCE IF EXISTS public.view360_view_id_seq;
DROP SEQUENCE IF EXISTS public.view360_image_image_id_seq;
DROP TABLE IF EXISTS public.view360_image;
DROP SEQUENCE IF EXISTS public.view360_hotspot_hotspot_id_seq;
DROP TABLE IF EXISTS public.view360_hotspot;
DROP TABLE IF EXISTS public.view360;
DROP SEQUENCE IF EXISTS public.users_user_id_seq;
DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.user_block;
DROP TABLE IF EXISTS public.travel_story_view;
DROP SEQUENCE IF EXISTS public.travel_story_story_id_seq;
DROP TABLE IF EXISTS public.travel_story;
DROP SEQUENCE IF EXISTS public.travel_post_share_share_id_seq;
DROP TABLE IF EXISTS public.travel_post_share;
DROP SEQUENCE IF EXISTS public.travel_post_report_report_id_seq;
DROP TABLE IF EXISTS public.travel_post_report;
DROP SEQUENCE IF EXISTS public.travel_post_post_id_seq;
DROP SEQUENCE IF EXISTS public.travel_post_photo_photo_id_seq;
DROP TABLE IF EXISTS public.travel_post_photo;
DROP TABLE IF EXISTS public.travel_post_like;
DROP SEQUENCE IF EXISTS public.travel_post_comment_comment_id_seq;
DROP TABLE IF EXISTS public.travel_post_comment;
DROP TABLE IF EXISTS public.travel_post;
DROP SEQUENCE IF EXISTS public.travel_destination_destination_id_seq;
DROP TABLE IF EXISTS public.travel_destination;
DROP SEQUENCE IF EXISTS public.tour_tour_id_seq;
DROP SEQUENCE IF EXISTS public.tour_destination_tour_destination_id_seq;
DROP TABLE IF EXISTS public.tour_destination;
DROP TABLE IF EXISTS public.tour_content_item_link;
DROP SEQUENCE IF EXISTS public.tour_content_item_content_item_id_seq;
DROP TABLE IF EXISTS public.tour_content_item;
DROP SEQUENCE IF EXISTS public.tour_category_tour_category_id_seq;
DROP TABLE IF EXISTS public.tour_category;
DROP TABLE IF EXISTS public.tour;
DROP SEQUENCE IF EXISTS public.statistics_stat_id_seq;
DROP TABLE IF EXISTS public.statistics;
DROP SEQUENCE IF EXISTS public.sepay_webhook_log_sepay_webhook_log_id_seq;
DROP TABLE IF EXISTS public.sepay_webhook_log;
DROP TABLE IF EXISTS public.saved_tour;
DROP TABLE IF EXISTS public.saved_destination;
DROP SEQUENCE IF EXISTS public.revoked_tokens_revoked_token_id_seq;
DROP TABLE IF EXISTS public.revoked_tokens;
DROP SEQUENCE IF EXISTS public.review_review_id_seq;
DROP SEQUENCE IF EXISTS public.review_photo_photo_id_seq;
DROP TABLE IF EXISTS public.review_photo;
DROP TABLE IF EXISTS public.review;
DROP SEQUENCE IF EXISTS public.refund_request_refund_request_id_seq;
DROP TABLE IF EXISTS public.refund_request;
DROP SEQUENCE IF EXISTS public.payment_payment_id_seq;
DROP TABLE IF EXISTS public.payment;
DROP SEQUENCE IF EXISTS public.password_reset_codes_reset_code_id_seq;
DROP TABLE IF EXISTS public.password_reset_codes;
DROP SEQUENCE IF EXISTS public.media_file_media_id_seq;
DROP TABLE IF EXISTS public.media_file;
DROP SEQUENCE IF EXISTS public.map_map_id_seq;
DROP TABLE IF EXISTS public.map;
DROP SEQUENCE IF EXISTS public.location_location_id_seq;
DROP TABLE IF EXISTS public.location;
DROP SEQUENCE IF EXISTS public.group_trip_member_group_trip_member_id_seq;
DROP TABLE IF EXISTS public.group_trip_member;
DROP SEQUENCE IF EXISTS public.group_trip_itinerary_item_itinerary_item_id_seq;
DROP TABLE IF EXISTS public.group_trip_itinerary_item;
DROP SEQUENCE IF EXISTS public.group_trip_invite_group_trip_invite_id_seq;
DROP TABLE IF EXISTS public.group_trip_invite;
DROP SEQUENCE IF EXISTS public.group_trip_group_trip_id_seq;
DROP TABLE IF EXISTS public.group_trip;
DROP SEQUENCE IF EXISTS public.email_verification_tokens_verification_id_seq;
DROP TABLE IF EXISTS public.email_verification_tokens;
DROP SEQUENCE IF EXISTS public.destination_category_destination_category_id_seq;
DROP TABLE IF EXISTS public.destination_category;
DROP SEQUENCE IF EXISTS public.coupon_coupon_id_seq;
DROP TABLE IF EXISTS public.coupon;
DROP SEQUENCE IF EXISTS public.booking_status_history_booking_status_history_id_seq;
DROP TABLE IF EXISTS public.booking_status_history;
DROP SEQUENCE IF EXISTS public.booking_detail_booking_detail_id_seq;
DROP TABLE IF EXISTS public.booking_detail;
DROP SEQUENCE IF EXISTS public.booking_booking_id_seq;
DROP TABLE IF EXISTS public.booking;
DROP TABLE IF EXISTS public.blog_location;
DROP SEQUENCE IF EXISTS public.blog_comment_comment_id_seq;
DROP TABLE IF EXISTS public.blog_comment;
DROP SEQUENCE IF EXISTS public.blog_category_blog_category_id_seq;
DROP TABLE IF EXISTS public.blog_category;
DROP SEQUENCE IF EXISTS public.blog_blog_id_seq;
DROP TABLE IF EXISTS public.blog_blog_category;
DROP TABLE IF EXISTS public.blog;
DROP SEQUENCE IF EXISTS public.ai_search_history_id_seq;
DROP TABLE IF EXISTS public.ai_search_history;
DROP SEQUENCE IF EXISTS public.ai_chat_history_chat_id_seq;
DROP TABLE IF EXISTS public.ai_chat_history;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__view360_image;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__view360_hotspot;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__view360;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__users;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__user_block;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_story_view;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_story;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_post_share;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_post_report;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_post_photo;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_post_like;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_post_comment;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_post;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__travel_destination;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__tour_destination;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__tour_content_item_link;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__tour_content_item;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__tour_category;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__tour;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__statistics;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__sepay_webhook_log;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__saved_tour;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__saved_destination;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__revoked_tokens;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__review_photo;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__review;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__refund_request;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__payment;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__password_reset_codes;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__media_file;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__map;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__location;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__group_trip_member;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__group_trip_itinerary_item;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__group_trip_invite;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__group_trip;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__email_verification_tokens;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__destination_category;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__coupon;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__booking_status_history;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__booking_detail;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__booking;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__blog_location;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__blog_comment;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__blog_category;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__blog_blog_category;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__blog;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__ai_search_history;
DROP TABLE IF EXISTS data_backups.pre_normalize_20260722_000005__ai_chat_history;
DROP TABLE IF EXISTS auth.webauthn_credentials;
DROP TABLE IF EXISTS auth.webauthn_challenges;
DROP TABLE IF EXISTS auth.users;
DROP TABLE IF EXISTS auth.sso_providers;
DROP TABLE IF EXISTS auth.sso_domains;
DROP TABLE IF EXISTS auth.sessions;
DROP TABLE IF EXISTS auth.schema_migrations;
DROP TABLE IF EXISTS auth.saml_relay_states;
DROP TABLE IF EXISTS auth.saml_providers;
DROP SEQUENCE IF EXISTS auth.refresh_tokens_id_seq;
DROP TABLE IF EXISTS auth.refresh_tokens;
DROP TABLE IF EXISTS auth.one_time_tokens;
DROP TABLE IF EXISTS auth.oauth_consents;
DROP TABLE IF EXISTS auth.oauth_clients;
DROP TABLE IF EXISTS auth.oauth_client_states;
DROP TABLE IF EXISTS auth.oauth_authorizations;
DROP TABLE IF EXISTS auth.mfa_factors;
DROP TABLE IF EXISTS auth.mfa_challenges;
DROP TABLE IF EXISTS auth.mfa_amr_claims;
DROP TABLE IF EXISTS auth.instances;
DROP TABLE IF EXISTS auth.identities;
DROP TABLE IF EXISTS auth.flow_state;
DROP TABLE IF EXISTS auth.custom_oauth_providers;
DROP TABLE IF EXISTS auth.audit_log_entries;
DROP FUNCTION IF EXISTS storage.update_updated_at_column();
DROP FUNCTION IF EXISTS storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text);
DROP FUNCTION IF EXISTS storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text);
DROP FUNCTION IF EXISTS storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);
DROP FUNCTION IF EXISTS storage.protect_delete();
DROP FUNCTION IF EXISTS storage.operation();
DROP FUNCTION IF EXISTS storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text);
DROP FUNCTION IF EXISTS storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text);
DROP FUNCTION IF EXISTS storage.get_size_by_bucket();
DROP FUNCTION IF EXISTS storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text);
DROP FUNCTION IF EXISTS storage.foldername(name text);
DROP FUNCTION IF EXISTS storage.filename(name text);
DROP FUNCTION IF EXISTS storage.extension(name text);
DROP FUNCTION IF EXISTS storage.enforce_bucket_name_length();
DROP FUNCTION IF EXISTS storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb);
DROP FUNCTION IF EXISTS storage.allow_only_operation(expected_operation text);
DROP FUNCTION IF EXISTS storage.allow_any_operation(expected_operations text[]);
DROP FUNCTION IF EXISTS realtime.wal2json_escape_identifier(name text);
DROP FUNCTION IF EXISTS realtime.topic();
DROP FUNCTION IF EXISTS realtime.to_regrole(role_name text);
DROP FUNCTION IF EXISTS realtime.subscription_check_filters();
DROP FUNCTION IF EXISTS realtime.send_binary(payload bytea, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.send(payload jsonb, event text, topic text, private boolean);
DROP FUNCTION IF EXISTS realtime.quote_wal2json(entity regclass);
DROP FUNCTION IF EXISTS realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer);
DROP FUNCTION IF EXISTS realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean);
DROP FUNCTION IF EXISTS realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text);
DROP FUNCTION IF EXISTS realtime."cast"(val text, type_ regtype);
DROP FUNCTION IF EXISTS realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]);
DROP FUNCTION IF EXISTS realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text);
DROP FUNCTION IF EXISTS realtime.apply_rls(wal jsonb, max_record_bytes integer);
DROP FUNCTION IF EXISTS pgbouncer.get_auth(p_usename text);
DROP FUNCTION IF EXISTS graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb);
DROP FUNCTION IF EXISTS extensions.set_graphql_placeholder();
DROP FUNCTION IF EXISTS extensions.pgrst_drop_watch();
DROP FUNCTION IF EXISTS extensions.pgrst_ddl_watch();
DROP FUNCTION IF EXISTS extensions.grant_pg_net_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_graphql_access();
DROP FUNCTION IF EXISTS extensions.grant_pg_cron_access();
DROP FUNCTION IF EXISTS auth.uid();
DROP FUNCTION IF EXISTS auth.role();
DROP FUNCTION IF EXISTS auth.jwt();
DROP FUNCTION IF EXISTS auth.email();
DROP TYPE IF EXISTS storage.buckettype;
DROP TYPE IF EXISTS realtime.wal_rls;
DROP TYPE IF EXISTS realtime.wal_column;
DROP TYPE IF EXISTS realtime.user_defined_filter;
DROP TYPE IF EXISTS realtime.equality_op;
DROP TYPE IF EXISTS realtime.action;
DROP TYPE IF EXISTS auth.one_time_token_type;
DROP TYPE IF EXISTS auth.oauth_response_type;
DROP TYPE IF EXISTS auth.oauth_registration_type;
DROP TYPE IF EXISTS auth.oauth_client_type;
DROP TYPE IF EXISTS auth.oauth_authorization_status;
DROP TYPE IF EXISTS auth.factor_type;
DROP TYPE IF EXISTS auth.factor_status;
DROP TYPE IF EXISTS auth.code_challenge_method;
DROP TYPE IF EXISTS auth.aal_level;
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS supabase_vault;
DROP EXTENSION IF EXISTS pgcrypto;
DROP EXTENSION IF EXISTS pg_stat_statements;
DROP SCHEMA IF EXISTS vault;
DROP SCHEMA IF EXISTS storage;
DROP SCHEMA IF EXISTS realtime;
DROP SCHEMA IF EXISTS pgbouncer;
DROP SCHEMA IF EXISTS graphql_public;
DROP SCHEMA IF EXISTS graphql;
DROP SCHEMA IF EXISTS extensions;
DROP SCHEMA IF EXISTS data_backups;
DROP SCHEMA IF EXISTS auth;
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: data_backups; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA data_backups;


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA extensions;


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql;


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA graphql_public;


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA pgbouncer;


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA realtime;


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA vault;


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
    'like',
    'ilike',
    'is',
    'match',
    'imatch',
    'isdistinct'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text,
	negate boolean
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
begin
    if not exists (
        select 1
        from pg_event_trigger_ddl_commands() ev
        join pg_catalog.pg_extension e on ev.objid = e.oid
        where e.extname = 'pg_graphql'
    ) then
        return;
    end if;

    drop function if exists graphql_public.graphql;
    create or replace function graphql_public.graphql(
        "operationName" text default null,
        query text default null,
        variables jsonb default null,
        extensions jsonb default null
    )
        returns jsonb
        language sql
    as $$
        select graphql.resolve(
            query := query,
            variables := coalesce(variables, '{}'),
            "operationName" := "operationName",
            extensions := extensions
        );
    $$;

    -- Attach the wrapper to the extension so DROP EXTENSION cascades to it,
    -- which in turn triggers set_graphql_placeholder to reinstall the "not enabled" stub.
    alter extension pg_graphql add function graphql_public.graphql(text, text, jsonb, jsonb);

    grant usage on schema graphql to postgres, anon, authenticated, service_role;
    grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    grant usage on schema graphql to postgres with grant option;
    grant usage on schema graphql_public to postgres with grant option;
end;
$_$;


--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: graphql(text, text, jsonb, jsonb); Type: FUNCTION; Schema: graphql_public; Owner: -
--

CREATE FUNCTION graphql_public.graphql("operationName" text DEFAULT NULL::text, query text DEFAULT NULL::text, variables jsonb DEFAULT NULL::jsonb, extensions jsonb DEFAULT NULL::jsonb) RETURNS jsonb
    LANGUAGE plpgsql
    AS $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;


--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
    -- Regclass of the table e.g. public.notes
    entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

    -- I, U, D, T: insert, update ...
    action realtime.action = (
        case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
        end
    );

    -- Is row level security enabled for the table
    is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

    subscriptions realtime.subscription[] = array_agg(subs)
        from
            realtime.subscription subs
        where
            subs.entity = entity_
            -- Filter by action early - only get subscriptions interested in this action
            -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
            and (subs.action_filter = '*' or subs.action_filter = action::text);

    -- Subscription vars
    working_role regrole;
    working_selected_columns text[];
    claimed_role regrole;
    claims jsonb;

    subscription_id uuid;
    subscription_has_access bool;
    visible_to_subscription_ids uuid[] = '{}';

    -- structured info for wal's columns
    columns realtime.wal_column[];
    -- previous identity values for update/delete
    old_columns realtime.wal_column[];

    error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

    -- Primary jsonb output for record
    output jsonb;

    -- Loop record for iterating unique roles (outer loop)
    role_record record;
    -- Loop record for iterating unique selected_columns within a role (inner loop)
    cols_record record;
    -- Subscription ids visible at the role level (before fanning out by selected_columns)
    visible_role_sub_ids uuid[] = '{}';

begin
    perform set_config('role', null, true);

    columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    old_columns =
        array_agg(
            (
                x->>'name',
                x->>'type',
                x->>'typeoid',
                realtime.cast(
                    (x->'value') #>> '{}',
                    coalesce(
                        (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                        (x->>'type')::regtype
                    )
                ),
                (pks ->> 'name') is not null,
                true
            )::realtime.wal_column
        )
        from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
                on (x ->> 'name') = (pks ->> 'name');

    for role_record in
        select claims_role
        from (select distinct claims_role from unnest(subscriptions)) t
        order by claims_role::text
    loop
        working_role := role_record.claims_role;

        -- Update `is_selectable` for columns and old_columns (once per role)
        columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(columns) c;

        old_columns =
                array_agg(
                    (
                        c.name,
                        c.type_name,
                        c.type_oid,
                        c.value,
                        c.is_pkey,
                        pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                    )::realtime.wal_column
                )
                from
                    unnest(old_columns) c;

        if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            -- Fan out 400 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 400: Bad Request, no primary key']
                )::realtime.wal_rls;
            end loop;

        -- The claims role does not have SELECT permission to the primary key of entity
        elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            -- Fan out 401 error per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;
                return next (
                    jsonb_build_object(
                        'schema', wal ->> 'schema',
                        'table', wal ->> 'table',
                        'type', action
                    ),
                    is_rls_enabled,
                    (select array_agg(s.subscription_id) from unnest(subscriptions) as s where s.claims_role = working_role and (s.selected_columns is not distinct from working_selected_columns)),
                    array['Error 401: Unauthorized']
                )::realtime.wal_rls;
            end loop;

        else
            -- Create the prepared statement (once per role)
            if is_rls_enabled and action <> 'DELETE' then
                if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                    deallocate walrus_rls_stmt;
                end if;
                execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            -- Collect all visible subscription IDs for this role (filter check + RLS check)
            visible_role_sub_ids = '{}';

            for subscription_id, claims in (
                    select
                        subs.subscription_id,
                        subs.claims
                    from
                        unnest(subscriptions) subs
                    where
                        subs.entity = entity_
                        and subs.claims_role = working_role
                        and (
                            realtime.is_visible_through_filters(columns, subs.filters)
                            or (
                              action = 'DELETE'
                              and realtime.is_visible_through_filters(old_columns, subs.filters)
                            )
                        )
            ) loop

                if not is_rls_enabled or action = 'DELETE' then
                    visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                else
                    -- Check if RLS allows the role to see the record
                    perform
                        -- Trim leading and trailing quotes from working_role because set_config
                        -- doesn't recognize the role as valid if they are included
                        set_config('role', trim(both '"' from working_role::text), true),
                        set_config('request.jwt.claims', claims::text, true);

                    execute 'execute walrus_rls_stmt' into subscription_has_access;

                    -- Reset the role on every FOR..LOOP batch execution.
                    -- The first batch of 10 rows is pre-fetched using the current connection role (PG internal behaviour)
                    -- then we have to reset it again otherwise it would use the role defined in the `set_config` above
                    -- to fetch the remaining rows when rows>10, which could be a user-defined role that lacks execution grants.
                    -- The flow is:
                    --   1. run batch with conn role
                    --   2. set_config working_role
                    --   3. execute walrus
                    --   4. reset role (revert)
                    --   5. repeat
                    perform set_config('role', null, true);

                    if subscription_has_access then
                        visible_role_sub_ids = visible_role_sub_ids || subscription_id;
                    end if;
                end if;
            end loop;

            perform set_config('role', null, true);

            -- Inner loop: per distinct selected_columns for this role
            for cols_record in
                select selected_columns
                from (select distinct selected_columns from unnest(subscriptions) s where s.claims_role = working_role) t
                order by coalesce(array_to_string(selected_columns, ','), '')
            loop
                working_selected_columns := cols_record.selected_columns;

                output = jsonb_build_object(
                    'schema', wal ->> 'schema',
                    'table', wal ->> 'table',
                    'type', action,
                    'commit_timestamp', to_char(
                        ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                        'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
                    ),
                    'columns', (
                        select
                            jsonb_agg(
                                jsonb_build_object(
                                    'name', pa.attname,
                                    'type', pt.typname
                                )
                                order by pa.attnum asc
                            )
                        from
                            pg_attribute pa
                            join pg_type pt
                                on pa.atttypid = pt.oid
                            left join (
                                select unnest(conkey) as pkey_attnum
                                from pg_constraint
                                where conrelid = entity_ and contype = 'p'
                            ) pk on pk.pkey_attnum = pa.attnum
                        where
                            attrelid = entity_
                            and attnum > 0
                            and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
                            and (working_selected_columns is null or pa.attname = any(working_selected_columns) or pk.pkey_attnum is not null)
                    )
                )
                -- Add "record" key for insert and update
                || case
                    when action in ('INSERT', 'UPDATE') then
                        jsonb_build_object(
                            'record',
                            (
                                select
                                    jsonb_object_agg(
                                        -- if unchanged toast, get column name and value from old record
                                        coalesce((c).name, (oc).name),
                                        case
                                            when (c).name is null then (oc).value
                                            else (c).value
                                        end
                                    )
                                from
                                    unnest(columns) c
                                    full outer join unnest(old_columns) oc
                                        on (c).name = (oc).name
                                where
                                    coalesce((c).is_selectable, (oc).is_selectable)
                                    and (working_selected_columns is null or coalesce((c).name, (oc).name) = any(working_selected_columns) or coalesce((c).is_pkey, (oc).is_pkey))
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            )
                        )
                    else '{}'::jsonb
                end
                -- Add "old_record" key for update and delete
                || case
                    when action = 'UPDATE' then
                        jsonb_build_object(
                                'old_record',
                                (
                                    select jsonb_object_agg((c).name, (c).value)
                                    from unnest(old_columns) c
                                    where
                                        (c).is_selectable
                                        and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                        and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                )
                            )
                    when action = 'DELETE' then
                        jsonb_build_object(
                            'old_record',
                            (
                                select jsonb_object_agg((c).name, (c).value)
                                from unnest(old_columns) c
                                where
                                    (c).is_selectable
                                    and (working_selected_columns is null or (c).name = any(working_selected_columns) or (c).is_pkey)
                                    and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                                    and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                            )
                        )
                    else '{}'::jsonb
                end;

                -- Filter visible_role_sub_ids to those matching the current selected_columns group
                visible_to_subscription_ids = coalesce(
                    (
                        select array_agg(s.subscription_id)
                        from unnest(subscriptions) s
                        where s.claims_role = working_role
                          and (s.selected_columns is not distinct from working_selected_columns)
                          and s.subscription_id = any(visible_role_sub_ids)
                    ),
                    '{}'::uuid[]
                );

                return next (
                    output,
                    is_rls_enabled,
                    visible_to_subscription_ids,
                    case
                        when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                        else '{}'
                    end
                )::realtime.wal_rls;
            end loop;

        end if;
    end loop;

    perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
/*
Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
*/
declare
    op_symbol text = (
        case
            when op = 'eq' then '='
            when op = 'neq' then '!='
            when op = 'lt' then '<'
            when op = 'lte' then '<='
            when op = 'gt' then '>'
            when op = 'gte' then '>='
            when op = 'in' then '= any'
            else 'UNKNOWN OP'
        end
    );
    res boolean;
begin
    execute format(
        'select %L::'|| type_::text || ' ' || op_symbol
        || ' ( %L::'
        || (
            case
                when op = 'in' then type_::text || '[]'
                else type_::text end
        )
        || ')', val_1, val_2) into res;
    return res;
end;
$$;


--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text, negate boolean) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
declare
    op_symbol text;
    res boolean;
begin
    -- IS DISTINCT FROM / IS NOT DISTINCT FROM: infix, both sides typed literals
    if op = 'isdistinct' then
        execute format(
            'select %L::%s %s %L::%s',
            val_1,
            type_::text,
            case when negate then 'IS NOT DISTINCT FROM' else 'IS DISTINCT FROM' end,
            val_2,
            type_::text
        ) into res;
        return res;
    end if;

    -- IS requires a keyword RHS (NULL, TRUE, FALSE, UNKNOWN), not a typed literal
    if op = 'is' then
        if val_2 not in ('null', 'true', 'false', 'unknown') then
            raise exception 'invalid value for is filter: must be null, true, false, or unknown';
        end if;
        execute format(
            'select %L::%s %s %s',
            val_1,
            type_::text,
            case when negate then 'IS NOT' else 'IS' end,
            upper(val_2)
        ) into res;
        return res;
    end if;

    op_symbol = case
        when op = 'eq'    then '='
        when op = 'neq'   then '!='
        when op = 'lt'    then '<'
        when op = 'lte'   then '<='
        when op = 'gt'    then '>'
        when op = 'gte'   then '>='
        when op = 'in'    then '= any'
        when op = 'like'   then 'LIKE'
        when op = 'ilike'  then 'ILIKE'
        when op = 'match'  then '~'
        when op = 'imatch' then '~*'
        else null
    end;

    if op_symbol is null then
        raise exception 'unsupported equality operator: %', op::text;
    end if;

    execute format(
        'select %L::%s %s (%L::%s)',
        val_1,
        type_::text,
        op_symbol,
        val_2,
        case when op = 'in' then type_::text || '[]' else type_::text end
    ) into res;

    return case when negate then not res else res end;
end;
$$;


--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
    select
        filters is null
        or array_length(filters, 1) is null
        or coalesce(
            count(col.name) = count(1)
            and sum(
                realtime.check_equality_op(
                    op:=f.op,
                    type_:=coalesce(col.type_oid::regtype, col.type_name::regtype),
                    val_1:=col.value #>> '{}',
                    val_2:=f.value,
                    negate:=coalesce(f.negate, false)
                )::int
            ) filter (where col.name is not null) = count(col.name),
            false
        )
    from
        unnest(filters) f
        left join unnest(columns) col
            on f.column_name = col.name;
$$;


--
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS TABLE(wal jsonb, is_rls_enabled boolean, subscription_ids uuid[], errors text[], slot_changes_count bigint)
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
  WITH pub AS (
    SELECT
      concat_ws(
        ',',
        CASE WHEN bool_or(pubinsert) THEN 'insert' ELSE NULL END,
        CASE WHEN bool_or(pubupdate) THEN 'update' ELSE NULL END,
        CASE WHEN bool_or(pubdelete) THEN 'delete' ELSE NULL END
      ) AS w2j_actions,
      coalesce(
        string_agg(
          realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
          ','
        ) filter (WHERE ppt.tablename IS NOT NULL),
        ''
      ) AS w2j_add_tables
    FROM pg_publication pp
    LEFT JOIN pg_publication_tables ppt ON pp.pubname = ppt.pubname
    WHERE pp.pubname = publication
    GROUP BY pp.pubname
    LIMIT 1
  ),
  -- MATERIALIZED ensures pg_logical_slot_get_changes is called exactly once
  w2j AS MATERIALIZED (
    SELECT x.*, pub.w2j_add_tables
    FROM pub,
         pg_logical_slot_get_changes(
           slot_name, null, max_changes,
           'include-pk', 'true',
           'include-transaction', 'false',
           'include-timestamp', 'true',
           'include-type-oids', 'true',
           'format-version', '2',
           'actions', pub.w2j_actions,
           'add-tables', pub.w2j_add_tables
         ) x
  ),
  slot_count AS (
    SELECT count(*)::bigint AS cnt
    FROM w2j
    WHERE w2j.w2j_add_tables <> ''
  ),
  rls_filtered AS (
    SELECT xyz.wal, xyz.is_rls_enabled, xyz.subscription_ids, xyz.errors
    FROM w2j,
         realtime.apply_rls(
           wal := w2j.data::jsonb,
           max_record_bytes := max_record_bytes
         ) xyz(wal, is_rls_enabled, subscription_ids, errors)
    WHERE w2j.w2j_add_tables <> ''
      AND xyz.subscription_ids[1] IS NOT NULL
  )
  SELECT rf.wal, rf.is_rls_enabled, rf.subscription_ids, rf.errors, sc.cnt
  FROM rls_filtered rf, slot_count sc

  UNION ALL

  SELECT null, null, null, null, sc.cnt
  FROM slot_count sc
  WHERE NOT EXISTS (SELECT 1 FROM rls_filtered)
$$;


--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  SELECT
    realtime.wal2json_escape_identifier(nsp.nspname::text)
    || '.'
    || realtime.wal2json_escape_identifier(pc.relname::text)
  FROM pg_class pc
  JOIN pg_namespace nsp ON pc.relnamespace = nsp.oid
  WHERE pc.oid = entity
$$;


--
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: send_binary(bytea, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.send_binary(payload bytea, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
BEGIN
  BEGIN
    generated_id := gen_random_uuid();

    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    INSERT INTO realtime.messages (id, binary_payload, event, topic, private, extension)
    VALUES (generated_id, payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      RAISE WARNING 'WarnSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
declare
    col_names text[] = coalesce(
            array_agg(a.attname order by a.attnum),
            '{}'::text[]
        )
        from
            pg_catalog.pg_attribute a
        where
            a.attrelid = new.entity
            and a.attnum > 0
            and not a.attisdropped
            and pg_catalog.has_column_privilege(
                (new.claims ->> 'role'),
                a.attrelid,
                a.attnum,
                'SELECT'
            );
    filter realtime.user_defined_filter;
    col_type regtype;
    in_val jsonb;
    selected_col text;
begin
    for filter in select * from unnest(new.filters) loop
        if not filter.column_name = any(col_names) then
            raise exception 'invalid column for filter %', filter.column_name;
        end if;

        col_type = (
            select atttypid::regtype
            from pg_catalog.pg_attribute
            where attrelid = new.entity
                  and attname = filter.column_name
        );
        if col_type is null then
            raise exception 'failed to lookup type for column %', filter.column_name;
        end if;

        if filter.op = 'in'::realtime.equality_op then
            in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
            if coalesce(jsonb_array_length(in_val), 0) > 100 then
                raise exception 'too many values for `in` filter. Maximum 100';
            end if;
        elsif filter.op = 'is'::realtime.equality_op then
            -- `is` requires a keyword RHS rather than a typed literal
            if filter.value not in ('null', 'true', 'false', 'unknown') then
                raise exception 'invalid value for is filter: must be null, true, false, or unknown';
            end if;
            -- IS NULL works for any type, but IS TRUE/FALSE/UNKNOWN require a boolean
            -- operand. Reject the non-null keywords on non-boolean columns here so they
            -- don't abort apply_rls at WAL time.
            if filter.value <> 'null' and col_type <> 'boolean'::regtype then
                raise exception 'is % filter requires a boolean column, got %', filter.value, col_type::text;
            end if;
        elsif filter.op in ('like'::realtime.equality_op, 'ilike'::realtime.equality_op) then
            -- like/ilike apply the text pattern operator (~~); reject column types that
            -- have no such operator instead of failing at WAL time
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = '~~' and oprleft = col_type
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
        elsif filter.op in ('match'::realtime.equality_op, 'imatch'::realtime.equality_op) then
            -- match/imatch apply the regex operators ~ / ~*; reject column types that have
            -- no such operator (e.g. integer) instead of failing at WAL time, mirroring the
            -- like/ilike guard above.
            if not exists (
                select 1 from pg_catalog.pg_operator
                where oprname = case when filter.op = 'imatch'::realtime.equality_op then '~*' else '~' end
                  and oprleft = col_type
                  and oprright = col_type
                  and oprresult = 'boolean'::regtype
            ) then
                raise exception 'operator % requires a text-compatible column type, got %', filter.op::text, col_type::text;
            end if;
            -- validate the regex eagerly so a bad pattern is rejected here, not inside
            -- apply_rls where it would abort the WAL stream for the entity
            begin
                perform '' ~ filter.value;
            exception when others then
                raise exception 'invalid regular expression for % filter: %', filter.op::text, sqlerrm;
            end;
        else
            -- eq/neq/lt/lte/gt/gte: value must be coercable to the type
            perform realtime.cast(filter.value, col_type);
        end if;
    end loop;

    if new.selected_columns is not null then
        for selected_col in select * from unnest(new.selected_columns) loop
            if not selected_col = any(col_names) then
                raise exception 'invalid column for select %', selected_col;
            end if;
        end loop;
    end if;

    -- Apply consistent order to filters so the unique constraint can't be tricked by a
    -- different filter order. negate is part of the sort key.
    new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value, f.negate),
        '{}'
    ) from unnest(new.filters) f;

    new.selected_columns = (
        select array_agg(c order by c)
        from unnest(new.selected_columns) c
    );

    return new;
end;
$$;


--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: wal2json_escape_identifier(text); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION realtime.wal2json_escape_identifier(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
  -- Prefix `\`, `,`, `.`, and any whitespace with `\`
  SELECT regexp_replace(name, '([\\,.[:space:]])', '\\\1', 'g')
$$;


--
-- Name: allow_any_operation(text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_any_operation(expected_operations text[]) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT CASE
      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
      ELSE raw_operation
    END AS current_operation
    FROM current_operation
  )
  SELECT EXISTS (
    SELECT 1
    FROM normalized n
    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation
    WHERE expected_operation IS NOT NULL
      AND expected_operation <> ''
      AND n.current_operation = CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END
  );
$$;


--
-- Name: allow_only_operation(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.allow_only_operation(expected_operation text) RETURNS boolean
    LANGUAGE sql STABLE
    AS $$
  WITH current_operation AS (
    SELECT storage.operation() AS raw_operation
  ),
  normalized AS (
    SELECT
      CASE
        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)
        ELSE raw_operation
      END AS current_operation,
      CASE
        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)
        ELSE expected_operation
      END AS requested_operation
    FROM current_operation
  )
  SELECT CASE
    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE
    ELSE COALESCE(current_operation = requested_operation, FALSE)
  END
  FROM normalized;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Get the last path segment (the actual filename)
    SELECT _parts[array_length(_parts, 1)] INTO _filename;
    -- Extract extension: reverse, split on '.', then reverse again
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


--
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    custom_claims_allowlist text[] DEFAULT '{}'::text[] NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


--
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


--
-- Name: pre_normalize_20260722_000005__ai_chat_history; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__ai_chat_history (
    chat_id integer,
    user_id integer,
    role character varying(20),
    content text,
    metadata jsonb,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__ai_search_history; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__ai_search_history (
    id integer,
    user_id integer,
    travel_request text,
    parsed_data jsonb,
    recommendations jsonb,
    model_version character varying(50),
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__blog; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__blog (
    blog_id integer,
    user_id integer,
    title character varying(255),
    content text,
    date_created date,
    slug character varying(255),
    thumbnail text,
    status character varying(20),
    published_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__blog_blog_category; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__blog_blog_category (
    blog_id integer,
    blog_category_id integer
);


--
-- Name: pre_normalize_20260722_000005__blog_category; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__blog_category (
    blog_category_id integer,
    name character varying(150),
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__blog_comment; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__blog_comment (
    comment_id integer,
    blog_id integer,
    user_id integer,
    content text,
    status character varying(20),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    parent_comment_id integer
);


--
-- Name: pre_normalize_20260722_000005__blog_location; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__blog_location (
    blog_id integer,
    location_id integer
);


--
-- Name: pre_normalize_20260722_000005__booking; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__booking (
    booking_id integer,
    user_id integer,
    tour_id integer,
    status character varying(50),
    payment_status character varying(50),
    date_created date,
    coupon_id integer,
    original_amount numeric(20,0),
    discount_amount numeric(20,0),
    final_amount numeric(20,0),
    canceled_at timestamp without time zone,
    canceled_by integer,
    cancel_reason text,
    departure_at timestamp without time zone,
    contact_phone character varying(20),
    currency character varying(3),
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__booking_detail; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__booking_detail (
    booking_detail_id integer,
    booking_id integer,
    passenger_name character varying(150),
    age_category character varying(50),
    price numeric(20,0),
    seat_number character varying(50),
    special_request text
);


--
-- Name: pre_normalize_20260722_000005__booking_status_history; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__booking_status_history (
    booking_status_history_id integer,
    booking_id integer,
    action character varying(100),
    from_status character varying(50),
    to_status character varying(50),
    from_payment_status character varying(50),
    to_payment_status character varying(50),
    reason text,
    changed_by integer,
    metadata jsonb,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__coupon; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__coupon (
    coupon_id integer,
    code character varying(50),
    name character varying(150),
    description text,
    discount_type character varying(50),
    discount_value numeric(20,0),
    max_discount_amount numeric(20,0),
    min_order_amount numeric(20,0),
    usage_limit integer,
    used_count integer,
    start_date date,
    end_date date,
    status character varying(50),
    created_by integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    archived_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__destination_category; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__destination_category (
    destination_category_id integer,
    name character varying(150),
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__email_verification_tokens; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__email_verification_tokens (
    verification_id integer,
    user_id integer,
    token_hash character varying(64),
    expires_at timestamp without time zone,
    used_at timestamp without time zone,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__group_trip; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__group_trip (
    group_trip_id integer,
    booking_id integer,
    name character varying(150),
    visibility character varying(20),
    leader_id integer,
    created_by integer,
    status character varying(20),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    description text,
    destination_id integer,
    destination_name character varying(200),
    start_date date,
    end_date date,
    max_members integer,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__group_trip_invite; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__group_trip_invite (
    group_trip_invite_id integer,
    group_trip_id integer,
    invited_user_id integer,
    invited_email character varying(255),
    invited_by integer,
    token_hash character varying(64),
    status character varying(20),
    expires_at timestamp without time zone,
    accepted_at timestamp without time zone,
    canceled_at timestamp without time zone,
    created_at timestamp without time zone,
    declined_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__group_trip_itinerary_item; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__group_trip_itinerary_item (
    itinerary_item_id integer,
    group_trip_id integer,
    itinerary_date date,
    start_time time without time zone,
    title character varying(200),
    description text,
    location_id integer,
    custom_location character varying(255),
    order_index integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    latitude numeric(10,7),
    longitude numeric(10,7)
);


--
-- Name: pre_normalize_20260722_000005__group_trip_member; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__group_trip_member (
    group_trip_member_id integer,
    group_trip_id integer,
    user_id integer,
    role character varying(20),
    status character varying(20),
    joined_at timestamp without time zone,
    left_at timestamp without time zone,
    removed_at timestamp without time zone,
    removed_by integer
);


--
-- Name: pre_normalize_20260722_000005__location; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__location (
    location_id integer,
    name character varying(200),
    latitude double precision,
    longitude double precision,
    description text,
    destination_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    thumbnail text,
    deleted_at timestamp without time zone,
    is_deleted boolean
);


--
-- Name: pre_normalize_20260722_000005__map; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__map (
    map_id integer,
    location_id integer,
    map_file text,
    description text,
    title character varying(255),
    display_order integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    is_deleted boolean
);


--
-- Name: pre_normalize_20260722_000005__media_file; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__media_file (
    media_id integer,
    uploaded_by integer,
    original_name character varying(255),
    file_name character varying(255),
    file_url text,
    mime_type character varying(100),
    file_size bigint,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__password_reset_codes; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__password_reset_codes (
    reset_code_id integer,
    user_id integer,
    code_hash character varying(64),
    reset_token_hash character varying(64),
    expires_at timestamp without time zone,
    verified_at timestamp without time zone,
    used_at timestamp without time zone,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__payment; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__payment (
    payment_id integer,
    booking_id integer,
    amount numeric(20,0),
    payment_method character varying(100),
    payment_date timestamp without time zone,
    status character varying(50),
    transaction_code character varying(255),
    currency character varying(20),
    payment_code character varying(50),
    payment_provider character varying(50),
    sepay_transaction_id character varying(100),
    bank_account character varying(100),
    transfer_content text,
    paid_at timestamp without time zone,
    expired_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__refund_request; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__refund_request (
    refund_request_id integer,
    booking_id integer,
    payment_id integer,
    requested_by integer,
    reason text,
    refund_amount numeric(12,2),
    status character varying(50),
    staff_note text,
    completed_by integer,
    completed_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    reviewed_by integer,
    reviewed_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__review; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__review (
    review_id integer,
    user_id integer,
    location_id integer,
    rating integer,
    comment text,
    images text,
    date_created date,
    status character varying(50),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    booking_id integer,
    tour_id integer
);


--
-- Name: pre_normalize_20260722_000005__review_photo; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__review_photo (
    photo_id integer,
    review_id integer,
    photo_url text,
    original_name character varying(255),
    mime_type character varying(100),
    file_size integer,
    created_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__revoked_tokens; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__revoked_tokens (
    revoked_token_id integer,
    token_hash character varying(64),
    user_id integer,
    expires_at timestamp without time zone,
    revoked_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__saved_destination; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__saved_destination (
    user_id integer,
    destination_id integer,
    created_at timestamp with time zone
);


--
-- Name: pre_normalize_20260722_000005__saved_tour; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__saved_tour (
    user_id integer,
    tour_id integer,
    created_at timestamp with time zone
);


--
-- Name: pre_normalize_20260722_000005__sepay_webhook_log; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__sepay_webhook_log (
    sepay_webhook_log_id integer,
    sepay_transaction_id character varying(100),
    payment_id integer,
    payment_code character varying(50),
    transfer_amount numeric(20,0),
    transfer_type character varying(50),
    raw_payload jsonb,
    status character varying(50),
    message text,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__statistics; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__statistics (
    stat_id integer,
    type character varying(100),
    data jsonb,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__tour; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__tour (
    tour_id integer,
    name character varying(255),
    description text,
    price numeric(20,0),
    schedule text,
    capacity integer,
    tour_category_id integer,
    status character varying(50),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    thumbnail text,
    deleted_at timestamp without time zone,
    start_at timestamp without time zone,
    child_price numeric(12,2),
    slug character varying(255),
    short_description text,
    duration_days integer,
    duration_nights integer,
    start_time time without time zone,
    end_time time without time zone,
    tour_type character varying(30),
    languages jsonb,
    difficulty character varying(30),
    minimum_participants integer,
    minimum_booking integer,
    maximum_booking integer,
    meeting_point text,
    pickup_available boolean,
    pickup_description text,
    highlights jsonb,
    inclusions jsonb,
    exclusions jsonb,
    requirements jsonb,
    cancellation_policy text,
    booking_policy text,
    additional_information text,
    faqs jsonb,
    video_url text,
    gallery jsonb,
    currency character varying(3),
    infant_price numeric(12,2)
);


--
-- Name: pre_normalize_20260722_000005__tour_category; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__tour_category (
    tour_category_id integer,
    name character varying(150),
    description text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__tour_content_item; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__tour_content_item (
    content_item_id integer,
    type character varying(40),
    content text,
    status character varying(20),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    normalized_content text
);


--
-- Name: pre_normalize_20260722_000005__tour_content_item_link; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__tour_content_item_link (
    tour_id integer,
    content_item_id integer,
    source_content_item_id integer,
    content_type character varying(40),
    snapshot_content text,
    sort_order integer,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__tour_destination; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__tour_destination (
    tour_destination_id integer,
    tour_id integer,
    destination_id integer,
    order_index integer,
    estimated_time character varying(100),
    note text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    day_number integer,
    start_time time without time zone,
    end_time time without time zone,
    estimated_minutes integer,
    activity text
);


--
-- Name: pre_normalize_20260722_000005__travel_destination; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_destination (
    destination_id integer,
    name character varying(200),
    description text,
    thumbnail text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    destination_category_id integer,
    latitude double precision,
    longitude double precision
);


--
-- Name: pre_normalize_20260722_000005__travel_post; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_post (
    post_id integer,
    user_id integer,
    content text,
    destination_id integer,
    location_id integer,
    status character varying(30),
    visibility character varying(30),
    like_count integer,
    comment_count integer,
    report_count integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone,
    share_count integer,
    previous_status character varying(30),
    deleted_by integer,
    restored_at timestamp without time zone,
    restored_by integer
);


--
-- Name: pre_normalize_20260722_000005__travel_post_comment; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_post_comment (
    comment_id integer,
    post_id integer,
    user_id integer,
    parent_comment_id integer,
    content text,
    status character varying(30),
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__travel_post_like; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_post_like (
    post_id integer,
    user_id integer,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__travel_post_photo; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_post_photo (
    photo_id integer,
    post_id integer,
    image_url character varying(500),
    display_order integer,
    created_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__travel_post_report; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_post_report (
    report_id integer,
    post_id integer,
    user_id integer,
    reason character varying(100),
    description text,
    status character varying(30),
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__travel_post_share; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_post_share (
    share_id integer,
    post_id integer,
    user_id integer,
    platform character varying(30),
    counted boolean,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__travel_story; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_story (
    story_id integer,
    user_id integer,
    media_url text,
    media_type character varying(10),
    caption character varying(1000),
    status character varying(20),
    expires_at timestamp without time zone,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__travel_story_view; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__travel_story_view (
    story_id integer,
    viewer_id integer,
    viewed_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__user_block; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__user_block (
    blocker_id integer,
    blocked_id integer,
    created_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__users; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__users (
    user_id integer,
    name character varying(150),
    email character varying(255),
    password character varying(255),
    role character varying(50),
    status character varying(50),
    profile_info text,
    google_id character varying(255),
    avatar_url text,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    phone character varying(30),
    date_of_birth date,
    gender character varying(20),
    address text,
    otp character varying(10),
    otp_expires_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__view360; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__view360 (
    view_id integer,
    location_id integer,
    description text,
    audio_file text,
    language character varying(50),
    title character varying(255),
    order_index integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__view360_hotspot; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__view360_hotspot (
    hotspot_id integer,
    view360_id integer,
    type character varying(50),
    title character varying(255),
    description text,
    yaw numeric(10,4),
    pitch numeric(10,4),
    target_view360_id integer,
    target_url text,
    order_index integer,
    is_active boolean,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: pre_normalize_20260722_000005__view360_image; Type: TABLE; Schema: data_backups; Owner: -
--

CREATE TABLE data_backups.pre_normalize_20260722_000005__view360_image (
    image_id integer,
    view_id integer,
    image_file text,
    order_index integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: ai_chat_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_chat_history (
    chat_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(20) NOT NULL,
    content text NOT NULL,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ai_chat_history_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'assistant'::character varying])::text[])))
);


--
-- Name: ai_chat_history_chat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_chat_history_chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_chat_history_chat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_chat_history_chat_id_seq OWNED BY public.ai_chat_history.chat_id;


--
-- Name: ai_search_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_search_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    travel_request text NOT NULL,
    parsed_data jsonb,
    recommendations jsonb,
    model_version character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: ai_search_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_search_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_search_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_search_history_id_seq OWNED BY public.ai_search_history.id;


--
-- Name: blog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog (
    blog_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    date_created date DEFAULT CURRENT_DATE NOT NULL,
    slug character varying(255) NOT NULL,
    thumbnail text,
    status character varying(20) DEFAULT 'published'::character varying NOT NULL,
    published_at timestamp without time zone,
    CONSTRAINT blog_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'archived'::character varying])::text[])))
);


--
-- Name: blog_blog_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_blog_category (
    blog_id integer NOT NULL,
    blog_category_id integer NOT NULL
);


--
-- Name: blog_blog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_blog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_blog_id_seq OWNED BY public.blog.blog_id;


--
-- Name: blog_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_category (
    blog_category_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: blog_category_blog_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_category_blog_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_category_blog_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_category_blog_category_id_seq OWNED BY public.blog_category.blog_category_id;


--
-- Name: blog_comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_comment (
    comment_id integer NOT NULL,
    blog_id integer NOT NULL,
    user_id integer NOT NULL,
    content text NOT NULL,
    status character varying(20) DEFAULT 'approved'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    parent_comment_id integer,
    CONSTRAINT chk_blog_comment_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[])))
);


--
-- Name: blog_comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_comment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_comment_comment_id_seq OWNED BY public.blog_comment.comment_id;


--
-- Name: blog_location; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_location (
    blog_id integer NOT NULL,
    location_id integer NOT NULL
);


--
-- Name: booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking (
    booking_id integer NOT NULL,
    user_id integer NOT NULL,
    tour_id integer NOT NULL,
    status character varying(50) NOT NULL,
    payment_status character varying(50) NOT NULL,
    date_created date DEFAULT CURRENT_DATE NOT NULL,
    coupon_id integer,
    original_amount numeric(20,0) DEFAULT 0 NOT NULL,
    discount_amount numeric(20,0) DEFAULT 0 NOT NULL,
    final_amount numeric(20,0) DEFAULT 0 NOT NULL,
    canceled_at timestamp without time zone,
    canceled_by integer,
    cancel_reason text,
    departure_at timestamp without time zone,
    contact_phone character varying(20),
    currency character varying(3) DEFAULT 'VND'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT booking_discount_amount_check CHECK ((discount_amount >= (0)::numeric)),
    CONSTRAINT booking_final_amount_check CHECK ((final_amount >= (0)::numeric)),
    CONSTRAINT booking_original_amount_check CHECK ((original_amount >= (0)::numeric)),
    CONSTRAINT booking_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['unpaid'::character varying, 'paid'::character varying, 'failed'::character varying, 'refunded'::character varying, 'pending'::character varying])::text[]))),
    CONSTRAINT booking_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'waiting_manual_confirmation'::character varying, 'confirmed'::character varying, 'cancel_pending'::character varying, 'canceled'::character varying, 'expired'::character varying])::text[])))
);


--
-- Name: booking_booking_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_booking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_booking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_booking_id_seq OWNED BY public.booking.booking_id;


--
-- Name: booking_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_detail (
    booking_detail_id integer NOT NULL,
    booking_id integer NOT NULL,
    passenger_name character varying(150) NOT NULL,
    age_category character varying(50) NOT NULL,
    price numeric(20,0) NOT NULL,
    seat_number character varying(50),
    special_request text,
    CONSTRAINT booking_detail_age_category_check CHECK (((age_category)::text = ANY (ARRAY[('adult'::character varying)::text, ('child'::character varying)::text, ('infant'::character varying)::text]))),
    CONSTRAINT booking_detail_price_check CHECK ((price >= (0)::numeric))
);


--
-- Name: booking_detail_booking_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_detail_booking_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_detail_booking_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_detail_booking_detail_id_seq OWNED BY public.booking_detail.booking_detail_id;


--
-- Name: booking_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.booking_status_history (
    booking_status_history_id integer NOT NULL,
    booking_id integer NOT NULL,
    action character varying(100) NOT NULL,
    from_status character varying(50),
    to_status character varying(50),
    from_payment_status character varying(50),
    to_payment_status character varying(50),
    reason text,
    changed_by integer,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: booking_status_history_booking_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.booking_status_history_booking_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: booking_status_history_booking_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.booking_status_history_booking_status_history_id_seq OWNED BY public.booking_status_history.booking_status_history_id;


--
-- Name: coupon; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupon (
    coupon_id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    discount_type character varying(50) NOT NULL,
    discount_value numeric(20,0) NOT NULL,
    max_discount_amount numeric(20,0),
    min_order_amount numeric(20,0) DEFAULT 0 NOT NULL,
    usage_limit integer,
    used_count integer DEFAULT 0 NOT NULL,
    start_date date,
    end_date date,
    status character varying(50) DEFAULT 'active'::character varying NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    archived_at timestamp without time zone,
    CONSTRAINT coupon_discount_type_check CHECK (((discount_type)::text = ANY ((ARRAY['percentage'::character varying, 'fixed'::character varying])::text[]))),
    CONSTRAINT coupon_discount_value_check CHECK ((discount_value >= (0)::numeric)),
    CONSTRAINT coupon_max_discount_amount_check CHECK (((max_discount_amount IS NULL) OR (max_discount_amount >= (0)::numeric))),
    CONSTRAINT coupon_min_order_amount_check CHECK ((min_order_amount >= (0)::numeric)),
    CONSTRAINT coupon_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'expired'::character varying, 'archived'::character varying])::text[]))),
    CONSTRAINT coupon_usage_limit_check CHECK (((usage_limit IS NULL) OR (usage_limit > 0))),
    CONSTRAINT coupon_used_count_check CHECK ((used_count >= 0))
);


--
-- Name: coupon_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupon_coupon_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupon_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupon_coupon_id_seq OWNED BY public.coupon.coupon_id;


--
-- Name: destination_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destination_category (
    destination_category_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: destination_category_destination_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.destination_category_destination_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: destination_category_destination_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.destination_category_destination_category_id_seq OWNED BY public.destination_category.destination_category_id;


--
-- Name: email_verification_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verification_tokens (
    verification_id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: email_verification_tokens_verification_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_verification_tokens_verification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_verification_tokens_verification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_verification_tokens_verification_id_seq OWNED BY public.email_verification_tokens.verification_id;


--
-- Name: group_trip; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_trip (
    group_trip_id integer NOT NULL,
    booking_id integer,
    name character varying(150) NOT NULL,
    visibility character varying(20) DEFAULT 'private'::character varying NOT NULL,
    leader_id integer NOT NULL,
    created_by integer NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    description text,
    destination_id integer,
    destination_name character varying(200),
    start_date date,
    end_date date,
    max_members integer,
    deleted_at timestamp without time zone,
    CONSTRAINT chk_group_trip_dates CHECK (((end_date IS NULL) OR (start_date IS NULL) OR (end_date >= start_date))),
    CONSTRAINT chk_group_trip_max_members CHECK (((max_members IS NULL) OR (max_members >= 2))),
    CONSTRAINT group_trip_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'archived'::character varying])::text[]))),
    CONSTRAINT group_trip_visibility_check CHECK (((visibility)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying])::text[])))
);


--
-- Name: group_trip_group_trip_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_trip_group_trip_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_trip_group_trip_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_trip_group_trip_id_seq OWNED BY public.group_trip.group_trip_id;


--
-- Name: group_trip_invite; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_trip_invite (
    group_trip_invite_id integer NOT NULL,
    group_trip_id integer NOT NULL,
    invited_user_id integer NOT NULL,
    invited_email character varying(255) NOT NULL,
    invited_by integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    accepted_at timestamp without time zone,
    canceled_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    declined_at timestamp without time zone,
    CONSTRAINT chk_group_trip_invite_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'accepted'::character varying, 'expired'::character varying, 'canceled'::character varying, 'declined'::character varying])::text[])))
);


--
-- Name: group_trip_invite_group_trip_invite_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_trip_invite_group_trip_invite_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_trip_invite_group_trip_invite_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_trip_invite_group_trip_invite_id_seq OWNED BY public.group_trip_invite.group_trip_invite_id;


--
-- Name: group_trip_itinerary_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_trip_itinerary_item (
    itinerary_item_id integer NOT NULL,
    group_trip_id integer NOT NULL,
    itinerary_date date NOT NULL,
    start_time time without time zone,
    title character varying(200) NOT NULL,
    description text,
    location_id integer,
    custom_location character varying(255),
    order_index integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    latitude numeric(10,7),
    longitude numeric(10,7),
    CONSTRAINT chk_group_trip_itinerary_latitude CHECK (((latitude IS NULL) OR ((latitude >= ('-90'::integer)::numeric) AND (latitude <= (90)::numeric)))),
    CONSTRAINT chk_group_trip_itinerary_longitude CHECK (((longitude IS NULL) OR ((longitude >= ('-180'::integer)::numeric) AND (longitude <= (180)::numeric)))),
    CONSTRAINT chk_group_trip_itinerary_order CHECK ((order_index >= 0))
);


--
-- Name: group_trip_itinerary_item_itinerary_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_trip_itinerary_item_itinerary_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_trip_itinerary_item_itinerary_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_trip_itinerary_item_itinerary_item_id_seq OWNED BY public.group_trip_itinerary_item.itinerary_item_id;


--
-- Name: group_trip_member; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_trip_member (
    group_trip_member_id integer NOT NULL,
    group_trip_id integer NOT NULL,
    user_id integer NOT NULL,
    role character varying(20) DEFAULT 'member'::character varying NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    left_at timestamp without time zone,
    removed_at timestamp without time zone,
    removed_by integer,
    CONSTRAINT group_trip_member_role_check CHECK (((role)::text = ANY ((ARRAY['leader'::character varying, 'member'::character varying])::text[]))),
    CONSTRAINT group_trip_member_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'left'::character varying, 'removed'::character varying])::text[])))
);


--
-- Name: group_trip_member_group_trip_member_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.group_trip_member_group_trip_member_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: group_trip_member_group_trip_member_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.group_trip_member_group_trip_member_id_seq OWNED BY public.group_trip_member.group_trip_member_id;


--
-- Name: location; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.location (
    location_id integer NOT NULL,
    name character varying(200) NOT NULL,
    latitude double precision,
    longitude double precision,
    description text,
    destination_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    thumbnail text,
    deleted_at timestamp without time zone,
    is_deleted boolean DEFAULT false NOT NULL
);


--
-- Name: location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.location_location_id_seq OWNED BY public.location.location_id;


--
-- Name: map; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map (
    map_id integer NOT NULL,
    location_id integer NOT NULL,
    map_file text,
    description text,
    title character varying(255) NOT NULL,
    display_order integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    is_deleted boolean DEFAULT false NOT NULL,
    CONSTRAINT chk_map_display_order CHECK (((display_order IS NULL) OR (display_order >= 0)))
);


--
-- Name: map_map_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.map_map_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: map_map_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.map_map_id_seq OWNED BY public.map.map_id;


--
-- Name: media_file; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media_file (
    media_id integer NOT NULL,
    uploaded_by integer,
    original_name character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url text NOT NULL,
    mime_type character varying(100) NOT NULL,
    file_size bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT media_file_file_size_check CHECK ((file_size >= 0))
);


--
-- Name: media_file_media_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.media_file_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: media_file_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.media_file_media_id_seq OWNED BY public.media_file.media_id;


--
-- Name: password_reset_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_codes (
    reset_code_id integer NOT NULL,
    user_id integer NOT NULL,
    code_hash character varying(64) NOT NULL,
    reset_token_hash character varying(64),
    expires_at timestamp without time zone NOT NULL,
    verified_at timestamp without time zone,
    used_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: password_reset_codes_reset_code_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_codes_reset_code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_reset_codes_reset_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_codes_reset_code_id_seq OWNED BY public.password_reset_codes.reset_code_id;


--
-- Name: payment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    booking_id integer NOT NULL,
    amount numeric(20,0) NOT NULL,
    payment_method character varying(100) DEFAULT 'bank_transfer'::character varying,
    payment_date timestamp without time zone,
    status character varying(50) NOT NULL,
    transaction_code character varying(255),
    currency character varying(20) DEFAULT 'VND'::character varying,
    payment_code character varying(50) NOT NULL,
    payment_provider character varying(50) DEFAULT 'sepay'::character varying,
    sepay_transaction_id character varying(100),
    bank_account character varying(100),
    transfer_content text,
    paid_at timestamp without time zone,
    expired_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT payment_amount_check CHECK ((amount >= (0)::numeric)),
    CONSTRAINT payment_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'failed'::character varying, 'expired'::character varying, 'refunded'::character varying])::text[])))
);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- Name: refund_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refund_request (
    refund_request_id integer NOT NULL,
    booking_id integer NOT NULL,
    payment_id integer NOT NULL,
    requested_by integer,
    reason text,
    refund_amount numeric(12,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    staff_note text,
    completed_by integer,
    completed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    CONSTRAINT refund_request_refund_amount_check CHECK ((refund_amount >= (0)::numeric)),
    CONSTRAINT refund_request_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'completed'::character varying])::text[])))
);


--
-- Name: refund_request_refund_request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refund_request_refund_request_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refund_request_refund_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refund_request_refund_request_id_seq OWNED BY public.refund_request.refund_request_id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review (
    review_id integer NOT NULL,
    user_id integer NOT NULL,
    location_id integer,
    rating integer NOT NULL,
    comment text,
    images text,
    date_created date DEFAULT CURRENT_DATE NOT NULL,
    status character varying(50) DEFAULT 'approved'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    booking_id integer,
    tour_id integer,
    CONSTRAINT chk_review_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))),
    CONSTRAINT review_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: review_photo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_photo (
    photo_id integer NOT NULL,
    review_id integer NOT NULL,
    photo_url text NOT NULL,
    original_name character varying(255),
    mime_type character varying(100),
    file_size integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT review_photo_file_size_check CHECK (((file_size IS NULL) OR (file_size >= 0)))
);


--
-- Name: review_photo_photo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_photo_photo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: review_photo_photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_photo_photo_id_seq OWNED BY public.review_photo.photo_id;


--
-- Name: review_review_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.review_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: review_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.review_review_id_seq OWNED BY public.review.review_id;


--
-- Name: revoked_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.revoked_tokens (
    revoked_token_id integer NOT NULL,
    token_hash character varying(64) NOT NULL,
    user_id integer,
    expires_at timestamp without time zone NOT NULL,
    revoked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: revoked_tokens_revoked_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.revoked_tokens_revoked_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: revoked_tokens_revoked_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.revoked_tokens_revoked_token_id_seq OWNED BY public.revoked_tokens.revoked_token_id;


--
-- Name: saved_destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_destination (
    user_id integer NOT NULL,
    destination_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: saved_tour; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.saved_tour (
    user_id integer NOT NULL,
    tour_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: sepay_webhook_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sepay_webhook_log (
    sepay_webhook_log_id integer NOT NULL,
    sepay_transaction_id character varying(100) NOT NULL,
    payment_id integer,
    payment_code character varying(50),
    transfer_amount numeric(20,0),
    transfer_type character varying(50),
    raw_payload jsonb NOT NULL,
    status character varying(50) DEFAULT 'received'::character varying NOT NULL,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: sepay_webhook_log_sepay_webhook_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sepay_webhook_log_sepay_webhook_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sepay_webhook_log_sepay_webhook_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sepay_webhook_log_sepay_webhook_log_id_seq OWNED BY public.sepay_webhook_log.sepay_webhook_log_id;


--
-- Name: statistics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.statistics (
    stat_id integer NOT NULL,
    type character varying(100),
    data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: statistics_stat_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.statistics_stat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: statistics_stat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.statistics_stat_id_seq OWNED BY public.statistics.stat_id;


--
-- Name: tour; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour (
    tour_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(20,0) NOT NULL,
    schedule text,
    capacity integer,
    tour_category_id integer,
    status character varying(50) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    thumbnail text,
    deleted_at timestamp without time zone,
    start_at timestamp without time zone,
    child_price numeric(12,2) DEFAULT 0 NOT NULL,
    slug character varying(255) NOT NULL,
    short_description text,
    duration_days integer DEFAULT 1 NOT NULL,
    duration_nights integer DEFAULT 0 NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    tour_type character varying(30) DEFAULT 'group'::character varying NOT NULL,
    languages jsonb DEFAULT '[]'::jsonb NOT NULL,
    difficulty character varying(30) DEFAULT 'easy'::character varying NOT NULL,
    minimum_participants integer DEFAULT 1 NOT NULL,
    minimum_booking integer DEFAULT 1 NOT NULL,
    maximum_booking integer,
    meeting_point text,
    pickup_available boolean DEFAULT false NOT NULL,
    pickup_description text,
    highlights jsonb DEFAULT '[]'::jsonb NOT NULL,
    inclusions jsonb DEFAULT '[]'::jsonb NOT NULL,
    exclusions jsonb DEFAULT '[]'::jsonb NOT NULL,
    requirements jsonb DEFAULT '[]'::jsonb NOT NULL,
    cancellation_policy text,
    booking_policy text,
    additional_information text,
    faqs jsonb DEFAULT '[]'::jsonb NOT NULL,
    video_url text,
    gallery jsonb DEFAULT '[]'::jsonb NOT NULL,
    currency character varying(3) DEFAULT 'VND'::character varying NOT NULL,
    infant_price numeric(12,2) DEFAULT 0 NOT NULL,
    CONSTRAINT chk_tour_status CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'draft'::character varying, 'deleted'::character varying])::text[]))),
    CONSTRAINT tour_capacity_check CHECK ((capacity >= 0)),
    CONSTRAINT tour_child_price_check CHECK ((child_price >= (0)::numeric)),
    CONSTRAINT tour_difficulty_check CHECK (((difficulty)::text = ANY ((ARRAY['easy'::character varying, 'moderate'::character varying, 'challenging'::character varying, 'difficult'::character varying])::text[]))),
    CONSTRAINT tour_duration_days_check CHECK ((duration_days >= 0)),
    CONSTRAINT tour_duration_nights_check CHECK ((duration_nights >= 0)),
    CONSTRAINT tour_infant_price_check CHECK ((infant_price >= (0)::numeric)),
    CONSTRAINT tour_maximum_booking_check CHECK (((maximum_booking IS NULL) OR (maximum_booking >= 1))),
    CONSTRAINT tour_minimum_booking_check CHECK ((minimum_booking >= 1)),
    CONSTRAINT tour_minimum_participants_check CHECK ((minimum_participants >= 1)),
    CONSTRAINT tour_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT tour_tour_type_check CHECK (((tour_type)::text = ANY ((ARRAY['group'::character varying, 'private'::character varying, 'self_guided'::character varying])::text[])))
);


--
-- Name: tour_category; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_category (
    tour_category_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tour_category_tour_category_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tour_category_tour_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tour_category_tour_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tour_category_tour_category_id_seq OWNED BY public.tour_category.tour_category_id;


--
-- Name: tour_content_item; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_content_item (
    content_item_id integer NOT NULL,
    type character varying(40) NOT NULL,
    content text NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    normalized_content text NOT NULL,
    CONSTRAINT tour_content_item_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[]))),
    CONSTRAINT tour_content_item_type_check CHECK (((type)::text = ANY ((ARRAY['highlight'::character varying, 'requirement'::character varying, 'inclusion'::character varying, 'exclusion'::character varying, 'booking_policy'::character varying, 'cancellation_policy'::character varying, 'additional_information'::character varying])::text[])))
);


--
-- Name: tour_content_item_content_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tour_content_item_content_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tour_content_item_content_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tour_content_item_content_item_id_seq OWNED BY public.tour_content_item.content_item_id;


--
-- Name: tour_content_item_link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_content_item_link (
    tour_id integer NOT NULL,
    content_item_id integer,
    source_content_item_id integer,
    content_type character varying(40) NOT NULL,
    snapshot_content text NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT tour_content_item_link_sort_order_check CHECK ((sort_order >= 1))
);


--
-- Name: tour_destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tour_destination (
    tour_destination_id integer NOT NULL,
    tour_id integer NOT NULL,
    destination_id integer NOT NULL,
    order_index integer NOT NULL,
    estimated_time character varying(100),
    note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    day_number integer DEFAULT 1 NOT NULL,
    start_time time without time zone,
    end_time time without time zone,
    estimated_minutes integer,
    activity text,
    CONSTRAINT tour_destination_day_number_check CHECK ((day_number >= 1)),
    CONSTRAINT tour_destination_estimated_minutes_check CHECK (((estimated_minutes IS NULL) OR (estimated_minutes >= 0))),
    CONSTRAINT tour_destination_order_index_check CHECK ((order_index >= 1))
);


--
-- Name: tour_destination_tour_destination_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tour_destination_tour_destination_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tour_destination_tour_destination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tour_destination_tour_destination_id_seq OWNED BY public.tour_destination.tour_destination_id;


--
-- Name: tour_tour_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tour_tour_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tour_tour_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tour_tour_id_seq OWNED BY public.tour.tour_id;


--
-- Name: travel_destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_destination (
    destination_id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    thumbnail text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    destination_category_id integer,
    latitude double precision,
    longitude double precision
);


--
-- Name: travel_destination_destination_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_destination_destination_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_destination_destination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_destination_destination_id_seq OWNED BY public.travel_destination.destination_id;


--
-- Name: travel_post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_post (
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    content text,
    destination_id integer,
    location_id integer,
    status character varying(30) DEFAULT 'published'::character varying NOT NULL,
    visibility character varying(30) DEFAULT 'public'::character varying NOT NULL,
    like_count integer DEFAULT 0 NOT NULL,
    comment_count integer DEFAULT 0 NOT NULL,
    report_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    share_count integer DEFAULT 0 NOT NULL,
    previous_status character varying(30),
    deleted_by integer,
    restored_at timestamp without time zone,
    restored_by integer,
    CONSTRAINT chk_travel_post_counts CHECK (((like_count >= 0) AND (comment_count >= 0) AND (report_count >= 0) AND (share_count >= 0))),
    CONSTRAINT chk_travel_post_previous_status CHECK (((previous_status IS NULL) OR ((previous_status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'hidden'::character varying])::text[])))),
    CONSTRAINT chk_travel_post_status CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'published'::character varying, 'hidden'::character varying, 'deleted'::character varying])::text[]))),
    CONSTRAINT chk_travel_post_visibility CHECK (((visibility)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying])::text[])))
);


--
-- Name: travel_post_comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_post_comment (
    comment_id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    parent_comment_id integer,
    content text NOT NULL,
    status character varying(30) DEFAULT 'published'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT chk_travel_post_comment_status CHECK (((status)::text = ANY ((ARRAY['published'::character varying, 'hidden'::character varying, 'deleted'::character varying])::text[])))
);


--
-- Name: travel_post_comment_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_post_comment_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_post_comment_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_post_comment_comment_id_seq OWNED BY public.travel_post_comment.comment_id;


--
-- Name: travel_post_like; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_post_like (
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: travel_post_photo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_post_photo (
    photo_id integer NOT NULL,
    post_id integer NOT NULL,
    image_url character varying(500) NOT NULL,
    display_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone
);


--
-- Name: travel_post_photo_photo_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_post_photo_photo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_post_photo_photo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_post_photo_photo_id_seq OWNED BY public.travel_post_photo.photo_id;


--
-- Name: travel_post_post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_post_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_post_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_post_post_id_seq OWNED BY public.travel_post.post_id;


--
-- Name: travel_post_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_post_report (
    report_id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    reason character varying(100) NOT NULL,
    description text,
    status character varying(30) DEFAULT 'pending'::character varying NOT NULL,
    reviewed_by integer,
    reviewed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_travel_post_report_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'dismissed'::character varying, 'resolved'::character varying])::text[])))
);


--
-- Name: travel_post_report_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_post_report_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_post_report_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_post_report_report_id_seq OWNED BY public.travel_post_report.report_id;


--
-- Name: travel_post_share; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_post_share (
    share_id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    platform character varying(30) NOT NULL,
    counted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_travel_post_share_platform CHECK (((platform)::text = ANY ((ARRAY['facebook'::character varying, 'zalo'::character varying, 'copy_link'::character varying, 'other'::character varying])::text[])))
);


--
-- Name: travel_post_share_share_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_post_share_share_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_post_share_share_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_post_share_share_id_seq OWNED BY public.travel_post_share.share_id;


--
-- Name: travel_story; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_story (
    story_id integer NOT NULL,
    user_id integer NOT NULL,
    media_url text NOT NULL,
    media_type character varying(10) NOT NULL,
    caption character varying(1000),
    status character varying(20) DEFAULT 'active'::character varying NOT NULL,
    expires_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP + '24:00:00'::interval) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT travel_story_media_type_check CHECK (((media_type)::text = ANY ((ARRAY['image'::character varying, 'video'::character varying])::text[]))),
    CONSTRAINT travel_story_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'deleted'::character varying])::text[])))
);


--
-- Name: travel_story_story_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.travel_story_story_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: travel_story_story_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.travel_story_story_id_seq OWNED BY public.travel_story.story_id;


--
-- Name: travel_story_view; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.travel_story_view (
    story_id integer NOT NULL,
    viewer_id integer NOT NULL,
    viewed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_block (
    blocker_id integer NOT NULL,
    blocked_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT chk_user_block_not_self CHECK ((blocker_id <> blocked_id))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    role character varying(50) NOT NULL,
    status character varying(50),
    profile_info text,
    google_id character varying(255),
    avatar_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    phone character varying(30),
    date_of_birth date,
    gender character varying(20),
    address text,
    otp character varying(10),
    otp_expires_at timestamp without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['guest'::character varying, 'customer'::character varying, 'staff'::character varying, 'admin'::character varying])::text[])))
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: view360; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.view360 (
    view_id integer NOT NULL,
    location_id integer NOT NULL,
    description text,
    audio_file text,
    language character varying(50),
    title character varying(255) NOT NULL,
    order_index integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT view360_order_index_check CHECK (((order_index IS NULL) OR (order_index >= 0)))
);


--
-- Name: view360_hotspot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.view360_hotspot (
    hotspot_id integer NOT NULL,
    view360_id integer NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying NOT NULL,
    title character varying(255),
    description text,
    yaw numeric(10,4) NOT NULL,
    pitch numeric(10,4) NOT NULL,
    target_view360_id integer,
    target_url text,
    order_index integer DEFAULT 0,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    CONSTRAINT view360_hotspot_type_check CHECK (((type)::text = ANY ((ARRAY['info'::character varying, 'navigation'::character varying, 'link'::character varying, 'location'::character varying])::text[])))
);


--
-- Name: view360_hotspot_hotspot_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.view360_hotspot_hotspot_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: view360_hotspot_hotspot_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.view360_hotspot_hotspot_id_seq OWNED BY public.view360_hotspot.hotspot_id;


--
-- Name: view360_image; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.view360_image (
    image_id integer NOT NULL,
    view_id integer NOT NULL,
    image_file text NOT NULL,
    order_index integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at timestamp without time zone,
    CONSTRAINT view360_image_order_index_check CHECK ((order_index >= 0))
);


--
-- Name: view360_image_image_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.view360_image_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: view360_image_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.view360_image_image_id_seq OWNED BY public.view360_image.image_id;


--
-- Name: view360_view_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.view360_view_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: view360_view_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.view360_view_id_seq OWNED BY public.view360.view_id;


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    binary_payload bytea
)
PARTITION BY RANGE (inserted_at);


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    selected_columns text[],
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb,
    metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: ai_chat_history chat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_chat_history ALTER COLUMN chat_id SET DEFAULT nextval('public.ai_chat_history_chat_id_seq'::regclass);


--
-- Name: ai_search_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_search_history ALTER COLUMN id SET DEFAULT nextval('public.ai_search_history_id_seq'::regclass);


--
-- Name: blog blog_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog ALTER COLUMN blog_id SET DEFAULT nextval('public.blog_blog_id_seq'::regclass);


--
-- Name: blog_category blog_category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_category ALTER COLUMN blog_category_id SET DEFAULT nextval('public.blog_category_blog_category_id_seq'::regclass);


--
-- Name: blog_comment comment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comment ALTER COLUMN comment_id SET DEFAULT nextval('public.blog_comment_comment_id_seq'::regclass);


--
-- Name: booking booking_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking ALTER COLUMN booking_id SET DEFAULT nextval('public.booking_booking_id_seq'::regclass);


--
-- Name: booking_detail booking_detail_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_detail ALTER COLUMN booking_detail_id SET DEFAULT nextval('public.booking_detail_booking_detail_id_seq'::regclass);


--
-- Name: booking_status_history booking_status_history_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_status_history ALTER COLUMN booking_status_history_id SET DEFAULT nextval('public.booking_status_history_booking_status_history_id_seq'::regclass);


--
-- Name: coupon coupon_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon ALTER COLUMN coupon_id SET DEFAULT nextval('public.coupon_coupon_id_seq'::regclass);


--
-- Name: destination_category destination_category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_category ALTER COLUMN destination_category_id SET DEFAULT nextval('public.destination_category_destination_category_id_seq'::regclass);


--
-- Name: email_verification_tokens verification_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens ALTER COLUMN verification_id SET DEFAULT nextval('public.email_verification_tokens_verification_id_seq'::regclass);


--
-- Name: group_trip group_trip_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip ALTER COLUMN group_trip_id SET DEFAULT nextval('public.group_trip_group_trip_id_seq'::regclass);


--
-- Name: group_trip_invite group_trip_invite_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_invite ALTER COLUMN group_trip_invite_id SET DEFAULT nextval('public.group_trip_invite_group_trip_invite_id_seq'::regclass);


--
-- Name: group_trip_itinerary_item itinerary_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_itinerary_item ALTER COLUMN itinerary_item_id SET DEFAULT nextval('public.group_trip_itinerary_item_itinerary_item_id_seq'::regclass);


--
-- Name: group_trip_member group_trip_member_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_member ALTER COLUMN group_trip_member_id SET DEFAULT nextval('public.group_trip_member_group_trip_member_id_seq'::regclass);


--
-- Name: location location_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location ALTER COLUMN location_id SET DEFAULT nextval('public.location_location_id_seq'::regclass);


--
-- Name: map map_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map ALTER COLUMN map_id SET DEFAULT nextval('public.map_map_id_seq'::regclass);


--
-- Name: media_file media_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_file ALTER COLUMN media_id SET DEFAULT nextval('public.media_file_media_id_seq'::regclass);


--
-- Name: password_reset_codes reset_code_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes ALTER COLUMN reset_code_id SET DEFAULT nextval('public.password_reset_codes_reset_code_id_seq'::regclass);


--
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- Name: refund_request refund_request_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request ALTER COLUMN refund_request_id SET DEFAULT nextval('public.refund_request_refund_request_id_seq'::regclass);


--
-- Name: review review_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review ALTER COLUMN review_id SET DEFAULT nextval('public.review_review_id_seq'::regclass);


--
-- Name: review_photo photo_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_photo ALTER COLUMN photo_id SET DEFAULT nextval('public.review_photo_photo_id_seq'::regclass);


--
-- Name: revoked_tokens revoked_token_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revoked_tokens ALTER COLUMN revoked_token_id SET DEFAULT nextval('public.revoked_tokens_revoked_token_id_seq'::regclass);


--
-- Name: sepay_webhook_log sepay_webhook_log_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sepay_webhook_log ALTER COLUMN sepay_webhook_log_id SET DEFAULT nextval('public.sepay_webhook_log_sepay_webhook_log_id_seq'::regclass);


--
-- Name: statistics stat_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statistics ALTER COLUMN stat_id SET DEFAULT nextval('public.statistics_stat_id_seq'::regclass);


--
-- Name: tour tour_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour ALTER COLUMN tour_id SET DEFAULT nextval('public.tour_tour_id_seq'::regclass);


--
-- Name: tour_category tour_category_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_category ALTER COLUMN tour_category_id SET DEFAULT nextval('public.tour_category_tour_category_id_seq'::regclass);


--
-- Name: tour_content_item content_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item ALTER COLUMN content_item_id SET DEFAULT nextval('public.tour_content_item_content_item_id_seq'::regclass);


--
-- Name: tour_destination tour_destination_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_destination ALTER COLUMN tour_destination_id SET DEFAULT nextval('public.tour_destination_tour_destination_id_seq'::regclass);


--
-- Name: travel_destination destination_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_destination ALTER COLUMN destination_id SET DEFAULT nextval('public.travel_destination_destination_id_seq'::regclass);


--
-- Name: travel_post post_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post ALTER COLUMN post_id SET DEFAULT nextval('public.travel_post_post_id_seq'::regclass);


--
-- Name: travel_post_comment comment_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_comment ALTER COLUMN comment_id SET DEFAULT nextval('public.travel_post_comment_comment_id_seq'::regclass);


--
-- Name: travel_post_photo photo_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_photo ALTER COLUMN photo_id SET DEFAULT nextval('public.travel_post_photo_photo_id_seq'::regclass);


--
-- Name: travel_post_report report_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_report ALTER COLUMN report_id SET DEFAULT nextval('public.travel_post_report_report_id_seq'::regclass);


--
-- Name: travel_post_share share_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_share ALTER COLUMN share_id SET DEFAULT nextval('public.travel_post_share_share_id_seq'::regclass);


--
-- Name: travel_story story_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_story ALTER COLUMN story_id SET DEFAULT nextval('public.travel_story_story_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: view360 view_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360 ALTER COLUMN view_id SET DEFAULT nextval('public.view360_view_id_seq'::regclass);


--
-- Name: view360_hotspot hotspot_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_hotspot ALTER COLUMN hotspot_id SET DEFAULT nextval('public.view360_hotspot_hotspot_id_seq'::regclass);


--
-- Name: view360_image image_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_image ALTER COLUMN image_id SET DEFAULT nextval('public.view360_image_image_id_seq'::regclass);


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at, custom_claims_allowlist) FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
dc86f49f-cabe-42af-9c00-6f5c79102906	dc86f49f-cabe-42af-9c00-6f5c79102906	{"sub": "dc86f49f-cabe-42af-9c00-6f5c79102906", "email": "duongnnce180374@fpt.edu.vn", "email_verified": false, "phone_verified": false}	email	2026-05-25 20:09:09.02541+07	2026-05-25 20:09:09.025472+07	2026-05-25 20:09:09.025472+07	52ba2451-5f6f-467f-97e8-73a80b965c85
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
f56067db-4094-451f-8148-839ee69e2917	dc86f49f-cabe-42af-9c00-6f5c79102906	confirmation_token	cfb2cc0e3cad9fb03b2c21cdcff53f28800e8d41dad4b67593b1f8f5	duongnnce180374@fpt.edu.vn	2026-05-25 13:09:10.459526	2026-05-25 13:09:10.459526
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
20260625000000
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
00000000-0000-0000-0000-000000000000	dc86f49f-cabe-42af-9c00-6f5c79102906	authenticated	authenticated	duongnnce180374@fpt.edu.vn		\N	2026-05-25 20:09:09.029951+07	cfb2cc0e3cad9fb03b2c21cdcff53f28800e8d41dad4b67593b1f8f5	2026-05-25 20:09:09.029951+07		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{}	\N	2026-05-25 20:09:08.999865+07	2026-05-25 20:09:10.452796+07	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- Data for Name: pre_normalize_20260722_000005__ai_chat_history; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__ai_chat_history (chat_id, user_id, role, content, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: pre_normalize_20260722_000005__ai_search_history; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__ai_search_history (id, user_id, travel_request, parsed_data, recommendations, model_version, created_at) FROM stdin;
7	58	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 5 triệu mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 5000000}	[{"name": "Dinh Độc Lập", "score": 0.640778, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}, {"name": "Bến Nhà Rồng", "score": 0.359222, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-18 18:18:56.791101
8	58	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 3 nghìn mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 3000}	[{"name": "Bến Nhà Rồng", "score": 0.77, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.23, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-18 18:20:08.886673
9	59	Tôi muốn đi biển cùng bạn bè gồm 9 người, ngân sách khoảng 4 triệu cho mỗi người	{"pax": 9, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 4000000}	[{"name": "Bến Nhà Rồng", "score": 0.801667, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.198333, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-19 19:58:16.011923
10	2	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 3 nghìn mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 3000}	[{"name": "Bến Nhà Rồng", "score": 0.77, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.23, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-19 21:19:30.952393
11	2	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 3 nghìn mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 3000}	[{"name": "Bến Nhà Rồng", "score": 0.77, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.23, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-20 16:27:33.78879
12	2	tôi và người yêu 2 người với tài chính 800k muốn đi chơi	{"pax": 2, "tour_type": "City Break", "cust_segment": "Young Professional", "budget_per_person_vnd": 800000}	[{"name": "Bến Nhà Rồng", "score": 0.735, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.265, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-21 20:41:53.563924
13	2	Gia đình 4 người muốn đi biển, ngân sách 5 triệu mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 5000000}	[{"name": "Dinh Độc Lập", "score": 0.640778, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}, {"name": "Bến Nhà Rồng", "score": 0.359222, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-21 20:45:43.779428
\.


--
-- Data for Name: pre_normalize_20260722_000005__blog; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__blog (blog_id, user_id, title, content, date_created, slug, thumbnail, status, published_at) FROM stdin;
9	51	bến Ninh Kiều	fggtcvbgjklnjjhkjyhuiinefmcifhiefi hijmoo,oklcvdbtnymh,j.kp,mnbvcsrdtiuerdcvbnjkopo98i7tyrdfghjuiouihkjoipugiyhjju 	2026-06-24	b-n-ninh-ki-u-9	\N	published	2026-06-23 10:00:00
2	2	Hướng Dẫn Tham Quan FPT University Trong Một Ngày	<img src="https://s3.cloudfly.vn/travellens/media/1782214256372-Delete-review-drawio.png" alt="Delete review.drawio.png" loading="lazy" /><p><br /></p>Nếu có dịp ghé thăm FPT University, đừng bỏ lỡ cơ hội khám phá Cổng Trời và tận hưởng không gian hiện đại, năng động tại đây.	2026-06-23	h-ng-d-n-tham-quan-fpt-university-trong-m-t-ng-y-2	\N	published	2026-06-23 00:00:00
3	2	Khám Phá Cổng Trời – Địa Điểm Check-in Được Yêu Thích Nhất	good<img src="https://s3.cloudfly.vn/travellens/media/1782214382526-PaymentStatusUpdate-drawio.png" alt="PaymentStatusUpdate.drawio.png" loading="lazy" /><p><br /></p>	2026-06-23	kh-m-ph-c-ng-tr-i-a-i-m-check-in-c-y-u-th-ch-nh-t-3	\N	published	2026-06-23 00:00:00
6	50	Một Buổi Chiều Yên Bình Tại Bến Ninh Kiều	<img src="https://s3.cloudfly.vn/travellens/media/1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg" alt="truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg" loading="lazy" /><p><br /></p><p>Bến Ninh Kiều là một trong những biểu tượng nổi tiếng của thành phố Cần Thơ. Tôi ghé thăm nơi đây vào buổi chiều và thật sự bị cuốn hút bởi khung cảnh thơ mộng bên dòng sông Hậu.</p><p>Khi mặt trời dần lặn, ánh nắng vàng phủ lên mặt nước tạo nên một khung cảnh tuyệt đẹp. Nhiều du khách dạo bộ, chụp ảnh và thưởng thức các món ăn đường phố dọc bến.</p><p>Buổi tối, khu vực này trở nên nhộn nhịp hơn với ánh đèn lung linh từ cầu đi bộ và các tàu du lịch. Đây là địa điểm lý tưởng để thư giãn sau một ngày dài khám phá thành phố.</p><p>Nếu có dịp đến Cần Thơ, đừng quên dành thời gian ngắm hoàng hôn tại Bến Ninh Kiều.</p>	2026-06-23	m-t-bu-i-chi-u-y-n-b-nh-t-i-b-n-ninh-ki-u-6	\N	published	2026-06-23 00:00:00
10	2	Hon Son	Đảo được mệnh danh là "Maldives Miền Tây" nhờ sự kết hợp hài hòa giữa màu xanh của trời, biển và những rặng dừa nghiêng bóng. Bờ biển trải dài với các bãi tắm uốn lượn như Bãi Bàng, Bãi Nhà, Bãi Giếng hay Bãi Bắc. Nước biển quanh năm xanh ngọc, kết hợp cùng những khối đá hình thù độc đáo tạo nên một bức tranh sơn thủy hữu tình. [1, 2, 3, 4]	2026-07-05	hon-son	\N	published	2026-07-05 16:36:14.689
5	50	Bình Minh Trên Chợ Nổi Cái Răng – Trải Nghiệm Không Thể Bỏ Lỡ	<p>Tôi bắt đầu chuyến đi từ lúc 5 giờ sáng để đến Chợ Nổi Cái Răng. Khi mặt trời dần ló dạng, hàng trăm chiếc ghe thuyền đã tấp nập mua bán trên sông.</p><p>Điều khiến tôi ấn tượng nhất là tiếng chào mời thân thiện của các tiểu thương và những món ăn sáng được chế biến ngay trên thuyền. Một tô hủ tiếu nóng giữa khung cảnh sông nước mang lại cảm giác rất đặc biệt.</p><p>Ngoài việc thưởng thức ẩm thực địa phương, du khách còn có thể tìm hiểu văn hóa giao thương đặc trưng của miền Tây Nam Bộ. Đây là trải nghiệm mà tôi nghĩ ai cũng nên thử ít nhất một lần.</p><p>Chợ Nổi Cái Răng không chỉ là điểm du lịch mà còn là nét đẹp văn hóa được gìn giữ qua nhiều thế hệ.</p>	2026-06-23	b-nh-minh-tr-n-ch-n-i-c-i-r-ng-tr-i-nghi-m-kh-ng-th-b-l-5	\N	published	2026-06-22 10:00:00
11	58	TEST Travel Story	<p>Với tuyến số 2A, việc xây dựng đoạn kéo dài đi Xuân Mai nhằm tăng cường kết nối giữa khu vực lõi với vùng ngoại thành phía Tây Nam, đồng thời hỗ trợ, hoàn thiện cơ cấu không gian đô thị của Thủ đô, hỗ trợ phát triển khu đô thị vệ tinh Xuân Mai.</p><p>Tuy nhiên hiện nay, TP Hà Nội đang triển đầu tư nâng cấp mở rộng quốc lộ 6 đoạn Ba La - Xuân Mai, cải tạo mặt cắt đường hiện có rộng từ 6-10 m lên đến 60 m. Do đó, để triển khai đồng thời, đồng bộ, tránh chồng lấn và đảm bảo hiệu quả kinh tế giữa các dự án, Thành ủy đã chỉ đạo tuyến 2A kéo dài dự kiến khởi công năm 2026 và hoàn thành thi công xây dựng tháng 12/2030.</p><p>Tuyến số 3 (đoạn Nhổn - Trôi và kéo dài đi Sơn Tây) có vai trò hoàn thiện trục hướng tâm quan trọng, kết nối đô thị trung tâm với đô thị vệ tinh Sơn Tây và vùng thượng lưu sông Hồng - Phú Thọ; phát triển theo mô hình đô thị dịch vụ, du lịch, văn hóa, lịch sử. Tuyến đồng thời đáp ứng yêu cầu giãn dân khu vực phía trong vành đai 3 và phát triển đô thị theo mô hình TOD theo Quy hoạch tổng thể Thủ đô tầm nhìn 100 năm.</p><img alt="Tàu điện tuyến Nhổn - ga Hà Nội. Ảnh: Giang Huy" src="https://i1-vnexpress.vnecdn.net/2026/07/21/wm1-wm1-ta-u-die-n-Nho-n-178461742-8215-7619-1784617833.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hnKIYiiTBTR76yYH6J1hdQ" loading="lazy" /><p>Tàu điện tuyến Nhổn - ga Hà Nội. Ảnh: <em>Giang Huy</em></p>	2026-07-19	test-travel-story	\N	published	2026-07-19 22:54:00
\.


--
-- Data for Name: pre_normalize_20260722_000005__blog_blog_category; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__blog_blog_category (blog_id, blog_category_id) FROM stdin;
9	1
5	2
\.


--
-- Data for Name: pre_normalize_20260722_000005__blog_category; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__blog_category (blog_category_id, name, description, created_at, updated_at) FROM stdin;
1	Khuyến Mãi	test	2026-07-04 21:52:22.703644	2026-07-04 21:52:22.703644
2	Tin Tức		2026-07-18 22:25:30.504853	2026-07-18 22:25:30.504853
\.


--
-- Data for Name: pre_normalize_20260722_000005__blog_comment; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__blog_comment (comment_id, blog_id, user_id, content, status, created_at, updated_at, deleted_at, parent_comment_id) FROM stdin;
1	5	55	leader đẹp trai	approved	2026-07-03 00:04:38.810623	2026-07-03 00:17:37.34146	\N	\N
2	5	55	như trên	approved	2026-07-03 00:10:02.432082	2026-07-03 00:19:38.537303	2026-07-03 00:19:38.537303	1
3	9	58	okokok	approved	2026-07-04 21:13:16.159472	2026-07-04 21:13:16.159472	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__blog_location; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__blog_location (blog_id, location_id) FROM stdin;
2	4
3	4
6	5
9	3
9	5
10	5
5	1
5	3
5	8
5	7
5	4
5	5
11	7
\.


--
-- Data for Name: pre_normalize_20260722_000005__booking; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__booking (booking_id, user_id, tour_id, status, payment_status, date_created, coupon_id, original_amount, discount_amount, final_amount, canceled_at, canceled_by, cancel_reason, departure_at, contact_phone, currency, created_at) FROM stdin;
68	58	6	confirmed	paid	2026-07-20	\N	3000	0	3000	\N	\N	\N	2026-07-23 09:00:00	0333622144	VND	2026-07-20 16:22:37.700138
71	55	6	expired	failed	2026-07-21	\N	3000	0	3000	\N	\N	\N	2026-07-21 09:00:00	0942375895	VND	2026-07-21 01:34:55.762299
73	58	6	expired	failed	2026-07-21	9	6000	3000	3000	\N	\N	\N	2026-07-25 09:00:00	0333622144	VND	2026-07-21 15:41:18.080933
70	58	6	cancel_pending	paid	2026-07-21	9	6000	3000	3000	\N	\N	\N	2026-07-25 09:00:00	0333622144	VND	2026-07-21 01:32:13.597843
7	1	1	confirmed	paid	2026-06-01	5	10000	1500	8500	\N	\N	\N	\N	\N	VND	2026-06-01 00:00:00
74	58	6	confirmed	paid	2026-07-21	9	6000	3000	3000	\N	\N	\N	2026-07-22 09:00:00	0333622144	VND	2026-07-21 16:10:34.02564
1	2	1	expired	unpaid	2026-06-01	5	700000	0	700000	\N	\N	\N	\N	\N	VND	2026-06-01 00:00:00
8	1	1	confirmed	paid	2026-06-02	5	7000	1050	5950	\N	\N	\N	\N	\N	VND	2026-06-02 00:00:00
9	1	1	expired	failed	2026-06-02	5	424	64	360	\N	\N	\N	\N	\N	VND	2026-06-02 00:00:00
11	50	4	canceled	unpaid	2026-06-23	\N	14128	0	14128	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
12	50	4	canceled	unpaid	2026-06-23	\N	14128	0	14128	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
10	1	1	confirmed	paid	2026-06-02	\N	2000	0	2000	\N	\N	\N	\N	\N	VND	2026-06-02 00:00:00
18	51	6	canceled	failed	2026-06-24	\N	3000	0	3000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
17	51	2	canceled	unpaid	2026-06-24	8	500000	100000	400000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
19	51	6	confirmed	paid	2026-06-24	\N	3000	0	3000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
21	51	4	confirmed	paid	2026-06-24	\N	3532	0	3532	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
22	51	6	confirmed	paid	2026-06-27	\N	3000	0	3000	\N	\N	\N	\N	\N	VND	2026-06-27 00:00:00
23	51	6	confirmed	paid	2026-06-27	\N	3000	0	3000	\N	\N	\N	\N	\N	VND	2026-06-27 00:00:00
24	51	4	confirmed	paid	2026-06-27	\N	3532	0	3532	\N	\N	\N	\N	\N	VND	2026-06-27 00:00:00
25	51	2	confirmed	paid	2026-06-29	10	250000	247500	2500	\N	\N	\N	\N	\N	VND	2026-06-29 00:00:00
20	51	2	expired	failed	2026-06-24	9	250000	10000	240000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
13	50	4	expired	unpaid	2026-06-23	\N	14128	0	14128	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
14	50	4	expired	unpaid	2026-06-23	\N	7064	0	7064	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
15	50	4	expired	unpaid	2026-06-23	\N	14128	0	14128	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
16	50	2	expired	unpaid	2026-06-24	\N	250000	0	250000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
27	57	1	canceled	unpaid	2026-06-29	\N	250000	0	250000	2026-06-29 16:00:59.556684	57	I changed my travel plan	2026-07-15 08:00:00	\N	VND	2026-06-29 00:00:00
30	57	2	expired	failed	2026-06-29	\N	250000	0	250000	\N	\N	\N	\N	\N	VND	2026-06-29 00:00:00
31	57	6	canceled	refunded	2026-06-29	\N	3000	0	3000	2026-06-29 17:02:49.832827	57	\N	2026-07-02 09:00:00	\N	VND	2026-06-29 00:00:00
32	57	6	canceled	refunded	2026-06-29	\N	3000	0	3000	2026-06-29 18:37:57.279972	57	bị bệnh	2026-07-01 15:00:00	\N	VND	2026-06-29 00:00:00
41	57	6	canceled	refunded	2026-06-29	\N	3000	0	3000	2026-06-29 21:29:34.968365	2	Cancel BK-41. Paid bookings will create a manual refund request for staff to process.	2026-07-02 02:00:00	\N	VND	2026-06-29 00:00:00
51	58	4	expired	failed	2026-06-30	\N	3532	0	3532	\N	\N	\N	2026-07-04 01:00:00	\N	VND	2026-06-30 00:00:00
52	58	4	expired	failed	2026-06-30	9	3532	1766	1766	\N	\N	\N	2026-07-02 01:00:00	\N	VND	2026-06-30 00:00:00
43	58	6	confirmed	paid	2026-06-29	\N	6000	0	6000	\N	\N	\N	2026-07-05 02:00:00	\N	VND	2026-06-29 00:00:00
54	58	4	canceled	paid	2026-07-01	11	13951	13951	0	2026-07-01 22:43:31.784778	58	thích	2026-07-10 01:00:00	\N	VND	2026-07-01 00:00:00
45	58	6	confirmed	paid	2026-06-30	9	4950	2475	2475	\N	\N	\N	2026-07-02 02:00:00	\N	VND	2026-06-30 00:00:00
34	57	6	cancel_pending	paid	2026-06-29	\N	3000	0	3000	\N	\N	\N	2026-07-01 09:00:00	\N	VND	2026-06-29 00:00:00
35	57	2	canceled	refunded	2026-06-29	10	1000000	990000	10000	2026-06-29 20:06:06.608277	2	FGNFG	2026-07-08 08:00:00	\N	VND	2026-06-29 00:00:00
53	58	4	confirmed	paid	2026-06-30	9	5828	2914	2914	\N	\N	\N	2026-07-11 01:00:00	\N	VND	2026-06-30 00:00:00
55	58	1	confirmed	paid	2026-07-01	11	662500	662500	0	\N	\N	\N	2026-07-30 01:00:00	\N	VND	2026-07-01 00:00:00
39	57	6	expired	failed	2026-06-29	10	54000	53460	540	\N	\N	\N	2026-07-04 02:00:00	\N	VND	2026-06-29 00:00:00
46	58	6	expired	failed	2026-06-30	\N	6900	0	6900	\N	\N	\N	2026-07-11 02:00:00	\N	VND	2026-06-30 00:00:00
40	57	2	expired	failed	2026-06-29	10	1750000	1000000	750000	\N	\N	\N	2026-07-09 01:00:00	\N	VND	2026-06-29 00:00:00
37	57	6	expired	failed	2026-06-29	\N	3000	0	3000	\N	\N	\N	2026-07-01 09:00:00	\N	VND	2026-06-29 00:00:00
38	57	6	expired	failed	2026-06-29	11	21000	21000	0	\N	\N	\N	2026-07-02 02:00:00	\N	VND	2026-06-29 00:00:00
42	57	4	expired	failed	2026-06-29	\N	3532	0	3532	\N	\N	\N	2026-07-04 01:00:00	\N	VND	2026-06-29 00:00:00
36	57	6	expired	failed	2026-06-29	\N	3000	0	3000	\N	\N	\N	2026-07-01 09:00:00	\N	VND	2026-06-29 00:00:00
44	58	6	expired	failed	2026-06-29	\N	6000	0	6000	\N	\N	\N	2026-07-12 02:00:00	\N	VND	2026-06-29 00:00:00
26	57	1	expired	failed	2026-06-29	\N	250000	0	250000	\N	\N	\N	\N	\N	VND	2026-06-29 00:00:00
28	57	1	expired	failed	2026-06-29	\N	250000	0	250000	\N	\N	\N	2026-06-30 08:00:00	\N	VND	2026-06-29 00:00:00
47	58	4	expired	failed	2026-06-30	\N	5828	0	5828	\N	\N	\N	2026-07-01 01:00:00	\N	VND	2026-06-30 00:00:00
48	58	6	expired	failed	2026-06-30	\N	4950	0	4950	\N	\N	\N	2026-07-04 02:00:00	\N	VND	2026-06-30 00:00:00
49	58	6	confirmed	paid	2026-06-30	11	3000	3000	0	\N	\N	\N	2026-07-01 02:00:00	\N	VND	2026-06-30 00:00:00
50	58	6	confirmed	paid	2026-06-30	\N	4950	0	4950	\N	\N	\N	2026-07-01 02:00:00	\N	VND	2026-06-30 00:00:00
57	58	2	canceled	paid	2026-07-01	11	1662500	1662500	0	2026-07-01 23:12:47.160497	58	Cancel BK-57. Paid bookings will create a manual refund request for staff to process.	2026-08-07 01:00:00	\N	VND	2026-07-01 00:00:00
59	58	1	confirmed	paid	2026-07-01	11	662500	662500	0	\N	\N	\N	2026-07-30 01:00:00	\N	VND	2026-07-01 00:00:00
60	58	2	confirmed	paid	2026-07-01	11	662500	662500	0	\N	\N	\N	2026-07-14 01:00:00	\N	VND	2026-07-01 00:00:00
58	58	6	expired	failed	2026-07-01	9	3000	1500	1500	\N	\N	\N	2026-07-15 02:00:00	\N	VND	2026-07-01 00:00:00
56	58	4	canceled	paid	2026-07-01	\N	3532	0	3532	2026-07-02 14:53:43.9381	2	nghèo hết tiền	2026-07-22 01:00:00	\N	VND	2026-07-01 00:00:00
61	57	2	expired	failed	2026-07-02	10	250000	247500	2500	\N	\N	\N	2026-07-04 08:00:00	\N	VND	2026-07-02 00:00:00
62	55	6	confirmed	paid	2026-07-02	11	3000	3000	0	\N	\N	\N	2026-07-02 02:00:00	\N	VND	2026-07-02 00:00:00
69	58	6	pending	unpaid	2026-07-21	9	6000	3000	3000	\N	\N	\N	2026-07-24 09:00:00	0333622144	VND	2026-07-21 01:26:33.332753
63	58	6	confirmed	paid	2026-07-19	9	7950	3975	3975	\N	\N	\N	2026-07-30 09:00:00	0333622144	VND	2026-07-19 22:24:01.622641
72	58	6	confirmed	paid	2026-07-21	9	6000	3000	3000	\N	\N	\N	2026-07-25 09:00:00	0333622144	VND	2026-07-21 01:38:34.660488
64	58	6	expired	failed	2026-07-20	\N	3000	0	3000	\N	\N	\N	2026-07-22 09:00:00	0333622144	VND	2026-07-20 03:17:35.005451
65	57	6	canceled	refunded	2026-07-20	\N	3000	0	3000	2026-07-20 13:51:17.844299	4	sdfg	2026-07-25 09:00:00	0763388155	VND	2026-07-20 13:46:43.747006
66	57	6	confirmed	paid	2026-07-20	\N	3000	0	3000	\N	\N	\N	2026-07-21 02:00:00	0763388155	VND	2026-07-20 14:00:49.036692
67	55	6	confirmed	paid	2026-07-20	\N	2000	0	2000	\N	\N	\N	2026-07-21 09:00:00	0826799459	VND	2026-07-20 14:04:49.636184
\.


--
-- Data for Name: pre_normalize_20260722_000005__booking_detail; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__booking_detail (booking_detail_id, booking_id, passenger_name, age_category, price, seat_number, special_request) FROM stdin;
1	1	Nguyen Van A	adult	700000	string	string
3	7	Nguyen Van 10	adult	10000	string	string
4	8	Nguyen Van Du	adult	7000	string	string
5	9	Nguyen Van A	adult	424	string	string
6	10	Nguyen Van A	adult	2000	string	string
7	11	Đoàn Thị Yến Nhi	adult	3532	\N	Preferred arrival time: 2026-06-26T03:35
8	11	Đoàn Thị Yến Nhi	adult	3532	\N	\N
9	11	Đoàn Thị Yến Nhi	adult	3532	\N	\N
10	11	Đoàn Thị Yến Nhi	child	3532	\N	\N
11	12	Đoàn Thị Yến Nhi	adult	3532	\N	Preferred arrival time: 2026-06-26T10:20
12	12	Đoàn Thị Yến Nhi	adult	3532	\N	\N
13	12	Đoàn Thị Yến Nhi	adult	3532	\N	\N
14	12	Đoàn Thị Yến Nhi	child	3532	\N	\N
15	13	Đoàn Thị Yến Nhi	adult	3532	\N	Preferred arrival time: 2026-06-30T04:42
16	13	Đoàn Thị Yến Nhi	adult	3532	\N	\N
17	13	Đoàn Thị Yến Nhi	adult	3532	\N	\N
18	13	Đoàn Thị Yến Nhi	child	3532	\N	\N
19	14	Đoàn Thị Yến Nhi	adult	3532	\N	Preferred arrival time: 2026-06-27T04:43
20	14	Đoàn Thị Yến Nhi	adult	3532	\N	\N
21	15	Doan Thi Yen Nhi	adult	3532	\N	Preferred arrival time: 2026-06-30T05:09 | Phone: 0794910788
22	15	Doan Thi Yen Nhi	adult	3532	\N	\N
23	15	Doan Thi Yen Nhi	adult	3532	\N	\N
24	15	Doan Thi Yen Nhi	adult	3532	\N	\N
25	16	Lê Thịnh	adult	250000	\N	Preferred arrival time: 2026-06-25T13:40 | Phone: 0912345678
26	17	Doan Thi Yen Nhi	adult	250000	\N	Preferred arrival time: 2026-06-30T14:27 | Phone: 0978945612
27	17	Doan Thi Yen Nhi	adult	250000	\N	\N
28	18	fsdfds	adult	3000	\N	Preferred arrival time: 2026-06-26T01:44 | Phone: 09090933333
29	19	tr366	adult	3000	\N	Preferred arrival time: 2026-07-04T01:46 | Phone: 4636
30	20	reyey	adult	250000	\N	Preferred arrival time: 2026-06-24T01:54 | Phone: 547547e
31	21	rỷy	adult	3532	\N	Preferred arrival time: 2026-06-26T01:56 | Phone: 547547e
32	22	EREỶT	adult	3000	\N	Travel date: 2026-06-28 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 37436346
33	23	Hoài Đẹp Trai	adult	3000	\N	Travel date: 2026-06-28 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0333622144
34	24	Hoài Đẹp Trai	adult	3532	\N	Travel date: 2026-07-10 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0333622144
35	25	HHH	adult	250000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 12345678
36	26	Test Customer Cancel	adult	250000	A1	Test cancel booking
37	27	Test Customer Cancel	adult	250000	A1	Test cancel booking
38	28	Test Under 24h	adult	250000	\N	\N
40	30	Dương	adult	250000	123	Travel date: 2026-07-01 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155 | 123
41	31	sdf	adult	3000	xcvb	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | dfg
42	32	sdfghdsfgh	adult	3000	dfdg	Travel date: 2026-06-30 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | dfdg
44	34	hgf	adult	3000	sfdgfnh	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | dgv
45	35	OIPOIOPI	adult	250000	\N	Travel date: 2026-07-08 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155
46	35	OIPOIOPI	child	250000	\N	\N
47	35	OIPOIOPI	adult	250000	\N	\N
48	35	OIPOIOPI	infant	250000	\N	\N
49	36	sd jcj s	adult	3000	nck	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | sm c
50	37	tfgfg	adult	3000	rhr	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | etgrt
51	38	dsg	adult	3000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155
52	38	dsg	adult	3000	\N	\N
53	38	dsg	adult	3000	\N	\N
54	38	dsg	child	3000	\N	\N
55	38	dsg	child	3000	\N	\N
56	38	dsg	child	3000	\N	\N
57	38	dsg	infant	3000	\N	\N
58	39	DSG	adult	3000	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155
59	39	DSG	adult	3000	\N	\N
60	39	DSG	child	3000	\N	\N
61	39	DSG	child	3000	\N	\N
62	39	DSG	infant	3000	\N	\N
63	39	DSG	infant	3000	\N	\N
64	39	DSG	infant	3000	\N	\N
65	39	DSG	infant	3000	\N	\N
66	39	DSG	child	3000	\N	\N
67	39	DSG	child	3000	\N	\N
68	39	DSG	child	3000	\N	\N
69	39	DSG	child	3000	\N	\N
70	39	DSG	child	3000	\N	\N
71	39	DSG	child	3000	\N	\N
72	39	DSG	child	3000	\N	\N
73	39	DSG	child	3000	\N	\N
74	39	DSG	child	3000	\N	\N
75	39	DSG	child	3000	\N	\N
76	40	SFA	adult	250000	\N	Travel date: 2026-07-09 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155
77	40	SFA	child	250000	\N	\N
78	40	SFA	child	250000	\N	\N
79	40	SFA	infant	250000	\N	\N
80	40	SFA	infant	250000	\N	\N
81	40	SFA	infant	250000	\N	\N
82	40	SFA	infant	250000	\N	\N
83	41	XCFB	adult	3000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155
84	42	XCBNXCVN	adult	3532	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155
85	43	reỷey	adult	3000	\N	Travel date: 2026-07-05 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 436346
86	43	reỷey	child	3000	\N	\N
87	44	cxb	adult	3000	\N	Travel date: 2026-07-12 | Tour schedule: 1 day 09:00 - 17:00 | Phone: xcb
88	44	cxb	child	3000	\N	\N
89	45	DFHEỶ	adult	3000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 648486
90	45	DFHEỶ	child	1950	\N	\N
91	46	XVCCB	adult	3000	\N	Travel date: 2026-07-11 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 436346
92	46	XVCCB	child	1950	\N	\N
93	46	XVCCB	child	1950	\N	\N
94	47	54	adult	3532	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 534
95	47	54	infant	0	\N	\N
96	47	54	child	2296	\N	\N
97	48	treu	adult	3000	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 457
98	48	treu	child	1950	\N	\N
99	49	ewtưêt	adult	3000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 4235325
100	50	ửywryw	adult	3000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 6426426
101	50	ửywryw	child	1950	\N	\N
102	51	EWTEWET	adult	3532	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 352353523
103	52	346346	adult	3532	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 43Y43Y34Y
104	53	2523523	adult	3532	\N	Travel date: 2026-07-11 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 324623532
105	53	2523523	child	2296	\N	\N
106	53	2523523	infant	0	\N	\N
107	54	HOÀI ĐẸP TRAI	adult	3532	\N	Travel date: 2026-07-10 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0333622144
108	54	HOÀI ĐẸP TRAI	adult	3532	\N	\N
109	54	HOÀI ĐẸP TRAI	child	2296	\N	\N
110	54	HOÀI ĐẸP TRAI	child	2296	\N	\N
111	54	HOÀI ĐẸP TRAI	child	2296	\N	\N
112	54	HOÀI ĐẸP TRAI	infant	0	\N	\N
113	55	3643643	adult	250000	\N	Travel date: 2026-07-30 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 7457457
114	55	3643643	adult	250000	\N	\N
115	55	3643643	child	162500	\N	\N
116	56	REWY	adult	3532	\N	Travel date: 2026-07-22 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 346432
117	57	2345	adult	250000	\N	Travel date: 2026-08-07 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 264265
118	57	2345	adult	250000	\N	\N
119	57	2345	adult	250000	\N	\N
120	57	2345	adult	250000	\N	\N
121	57	2345	adult	250000	\N	\N
122	57	2345	adult	250000	\N	\N
123	57	2345	child	162500	\N	\N
124	58	4363	adult	3000	\N	Travel date: 2026-07-15 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 4363463
125	59	ẺYEỶE	adult	250000	\N	Travel date: 2026-07-30 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 457754
126	59	ẺYEỶE	adult	250000	\N	\N
127	59	ẺYEỶE	child	162500	\N	\N
128	59	ẺYEỶE	infant	0	\N	\N
129	60	erỷỷ	adult	250000	\N	Travel date: 2026-07-14 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 75474
130	60	erỷỷ	adult	250000	\N	\N
131	60	erỷỷ	child	162500	\N	\N
132	61	Hoài	adult	250000	sdfdg	sdfd\nContact phone: 0906901402
133	62	32	adult	3000	\N	Travel date: 2026-07-03 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 32R523
134	63	Phạm Văn Hoài	adult	3000	\N	\N
135	63	Phạm Văn Hoài	child	1950	\N	\N
136	63	Phạm Văn Hoài	adult	3000	\N	\N
137	64	hoai pham	adult	3000	\N	\N
138	65	chi duong	adult	3000	\N	\N
139	66	Nguyễn Chí Dương	adult	3000	ad	dsf
140	67	Le Dang Khoa	adult	2000	\N	\N
141	67	Le Dang Khoa	infant	0	\N	\N
142	68	HOAI D	adult	3000	\N	\N
143	69	hoài phạm	adult	3000	\N	\N
144	69	hoài phạm	adult	3000	\N	\N
145	70	h p	adult	3000	\N	\N
146	70	h p	adult	3000	\N	\N
147	71	Le Dang Khoa	adult	3000	\N	\N
148	72	ja s	adult	3000	\N	\N
149	72	ja s	adult	3000	\N	\N
150	73	Phạm Văn Hoài	adult	3000	\N	\N
151	73	Phạm Văn Hoài	adult	3000	\N	\N
152	74	Phạm Văn Hoài	adult	3000	\N	\N
153	74	Phạm Văn Hoài	adult	3000	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__booking_status_history; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__booking_status_history (booking_status_history_id, booking_id, action, from_status, to_status, from_payment_status, to_payment_status, reason, changed_by, metadata, created_at) FROM stdin;
1	20	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-29 15:22:01.697084
2	13	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.599282
3	14	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.710399
4	15	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.816532
5	16	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.923542
6	26	booking_created	\N	pending	\N	unpaid	\N	57	{"final_amount": "250000", "passenger_count": 1}	2026-06-29 15:35:37.718564
7	27	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-15T01:00:00.000Z", "final_amount": "250000", "passenger_count": 1}	2026-06-29 16:00:24.548796
8	27	booking_canceled	pending	canceled	unpaid	unpaid	I changed my travel plan	57	{"expired_pending_payments": 0}	2026-06-29 16:00:59.556684
9	28	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-06-30T01:00:00.000Z", "final_amount": "250000", "passenger_count": 1}	2026-06-29 16:02:01.717687
11	30	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-29 16:09:01.206972
12	31	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 17:01:09.8141
13	31	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 15, "sepay_transaction_id": "65648744"}	2026-06-29 17:01:35.896574
14	31	booking_canceled_refund_pending	confirmed	canceled	paid	paid	\N	57	{"payment_id": 15, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 1}	2026-06-29 17:02:49.832827
15	31	manual_refund_approved	canceled	canceled	paid	paid	đã hoàn tiền	2	{"payment_id": 15, "refund_amount": "3000.00", "refund_request_id": 1}	2026-06-29 18:02:51.497917
16	31	manual_refund_completed	canceled	canceled	paid	refunded	lkjhg	2	{"payment_id": 15, "refund_amount": "3000.00", "transaction_code": null, "refund_request_id": 1}	2026-06-29 18:04:38.898635
17	32	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 18:10:41.475111
18	32	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 16, "sepay_transaction_id": "65662559"}	2026-06-29 18:11:10.924087
19	32	booking_canceled_refund_pending	confirmed	canceled	paid	paid	bị bệnh	57	{"payment_id": 16, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 2}	2026-06-29 18:37:57.279972
20	32	manual_refund_approved	canceled	canceled	paid	paid	duyệt	2	{"payment_id": 16, "refund_amount": "3000.00", "refund_request_id": 2}	2026-06-29 18:39:01.865707
21	32	manual_refund_completed	canceled	canceled	paid	refunded	1485	2	{"payment_id": 16, "refund_amount": "3000.00", "transaction_code": "147852", "refund_request_id": 2}	2026-06-29 18:39:14.872021
26	34	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 18:57:53.119911
27	34	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 18, "sepay_transaction_id": "65670623"}	2026-06-29 18:58:14.586359
28	34	booking_cancel_requested	confirmed	pending	paid	paid	hủy	57	{"payment_id": 18, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 4}	2026-06-29 18:58:44.542474
29	34	manual_refund_rejected	cancel_pending	confirmed	paid	paid	\N	2	{"payment_id": 18, "refund_amount": "3000.00", "refund_request_id": 4}	2026-06-29 19:25:24.005853
30	34	booking_cancel_requested	confirmed	cancel_pending	paid	paid	test	57	{"payment_id": 18, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 5}	2026-06-29 19:25:57.780972
31	34	manual_refund_rejected	cancel_pending	confirmed	paid	paid	\N	2	{"payment_id": 18, "refund_amount": "3000.00", "refund_request_id": 5}	2026-06-29 19:26:18.936126
32	35	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-08T01:00:00.000Z", "final_amount": "10000", "passenger_count": 4}	2026-06-29 19:47:17.945064
33	35	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 19, "sepay_transaction_id": "65678882"}	2026-06-29 19:47:38.576706
34	35	booking_cancel_requested	confirmed	cancel_pending	paid	paid	FGNFG	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 19:48:15.242993
35	35	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	sfh	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 19:58:32.799647
36	35	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	vad	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 19:59:34.198578
37	35	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	tdj	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 20:00:18.991515
38	34	booking_cancel_requested	confirmed	cancel_pending	paid	paid	b n	57	{"payment_id": 18, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 7}	2026-06-29 20:05:00.228502
39	35	manual_refund_approved	cancel_pending	canceled	paid	paid	ok	2	{"payment_id": 19, "refund_amount": "10000.00", "refund_request_id": 6}	2026-06-29 20:06:06.608277
40	35	manual_refund_completed	canceled	canceled	paid	refunded	48\n8435	2	{"payment_id": 19, "refund_amount": "10000.00", "transaction_code": "432515", "refund_request_id": 6}	2026-06-29 20:06:48.378527
41	36	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 20:29:13.479997
42	37	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 20:44:12.491713
43	38	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "0", "passenger_count": 7}	2026-06-29 21:11:26.717996
44	39	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-04T02:00:00.000Z", "final_amount": "540", "passenger_count": 18}	2026-06-29 21:12:59.772568
45	40	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-09T01:00:00.000Z", "final_amount": "750000", "passenger_count": 7}	2026-06-29 21:13:52.008998
46	41	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 21:14:29.132132
47	41	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 25, "sepay_transaction_id": "65692984"}	2026-06-29 21:14:45.601194
48	41	booking_canceled_refund_pending	confirmed	canceled	paid	paid	FDSHH	57	{"payment_id": 25, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 8}	2026-06-29 21:15:27.58863
49	41	manual_refund_rejected	canceled	confirmed	paid	paid	VCN	2	{"payment_id": 25, "refund_amount": "3000.00", "refund_request_id": 8}	2026-06-29 21:28:49.024266
50	41	booking_cancel_requested	confirmed	cancel_pending	paid	paid	Cancel BK-41. Paid bookings will create a manual refund request for staff to process.	57	{"payment_id": 25, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 9}	2026-06-29 21:29:14.379982
51	41	manual_refund_approved	cancel_pending	canceled	paid	paid	Request #9 for booking BK-41.	2	{"payment_id": 25, "refund_amount": "3000.00", "refund_request_id": 9}	2026-06-29 21:29:34.968365
52	41	manual_refund_completed	canceled	canceled	paid	refunded	Request #9 for booking BK-41.	2	{"payment_id": 25, "refund_amount": "3000.00", "transaction_code": "Request #9 for booking BK-41.", "refund_request_id": 9}	2026-06-29 21:30:03.149202
53	42	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-04T01:00:00.000Z", "final_amount": "3532", "passenger_count": 1}	2026-06-29 21:30:31.852911
54	43	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-05T02:00:00.000Z", "final_amount": "6000", "passenger_count": 2}	2026-06-29 23:08:04.213186
55	43	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 27, "sepay_transaction_id": "65707025"}	2026-06-29 23:10:08.328083
56	44	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-12T02:00:00.000Z", "final_amount": "6000", "passenger_count": 2}	2026-06-29 23:14:16.323371
57	45	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "2475", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-06-30 00:14:25.958843
58	45	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 29, "sepay_transaction_id": "65713026"}	2026-06-30 00:16:07.849359
59	46	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-11T02:00:00.000Z", "final_amount": "6900", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-06-30 00:17:33.088675
60	39	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
61	46	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
62	40	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
63	37	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
64	38	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
65	42	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
66	36	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
67	44	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
68	26	booking_auto_expired	pending	expired	unpaid	failed	Unpaid booking expired automatically	\N	{}	2026-06-30 00:37:59.275107
69	28	booking_auto_expired	pending	expired	unpaid	failed	Unpaid booking expired automatically	\N	{}	2026-06-30 00:37:59.275107
70	47	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-06-30T18:00:00.000Z", "final_amount": "5828", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-06-30 00:41:13.679376
71	47	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:56:44.025246
72	48	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-03T19:00:00.000Z", "final_amount": "4950", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-06-30 00:58:05.655638
73	48	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 01:02:15.468519
74	49	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-06-30T19:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 1, "payment_required": false}	2026-06-30 16:12:18.443459
75	50	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-06-30T19:00:00.000Z", "final_amount": "4950", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-06-30 16:13:10.298757
76	50	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 33, "sepay_transaction_id": "65804297"}	2026-06-30 16:15:50.336273
77	51	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-03T18:00:00.000Z", "final_amount": "3532", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-06-30 16:21:53.072563
78	52	booking_created	\N	waiting_manual_confirmation	\N	unpaid	\N	58	{"departure_at": "2026-07-01T18:00:00.000Z", "final_amount": "1766", "payment_method": "manual", "passenger_count": 1, "payment_required": true}	2026-06-30 16:22:28.760717
79	53	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-10T18:00:00.000Z", "final_amount": "2914", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-06-30 16:23:44.141258
80	53	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 35, "sepay_transaction_id": "65805714"}	2026-06-30 16:24:15.188828
81	51	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 16:37:12.38838
82	52	manual_confirmation_auto_expired	waiting_manual_confirmation	expired	unpaid	failed	Manual payment confirmation window expired	\N	{}	2026-07-01 01:38:57.004519
83	54	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-09T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 6, "payment_required": false}	2026-07-01 22:39:08.768653
84	54	booking_canceled	confirmed	canceled	paid	paid	thích	58	{"expired_pending_payments": 0}	2026-07-01 22:43:31.784778
85	53	booking_cancel_requested	confirmed	cancel_pending	paid	paid	test	58	{"payment_id": 35, "refund_amount": 2914, "refund_percent": 100, "refund_request_id": 10}	2026-07-01 22:45:03.05234
86	53	manual_refund_rejected	cancel_pending	confirmed	paid	paid	sdgsdg	51	{"payment_id": 35, "refund_amount": "2914.00", "refund_request_id": 10}	2026-07-01 22:46:00.983694
87	55	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-29T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 3, "payment_required": false}	2026-07-01 22:59:53.480438
88	56	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-21T18:00:00.000Z", "final_amount": "3532", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-01 23:01:03.604904
89	56	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 36, "sepay_transaction_id": "66040243"}	2026-07-01 23:01:27.063091
90	57	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-08-06T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 7, "payment_required": false}	2026-07-01 23:10:23.528333
91	57	booking_canceled	confirmed	canceled	paid	paid	Cancel BK-57. Paid bookings will create a manual refund request for staff to process.	58	{"expired_pending_payments": 0}	2026-07-01 23:12:47.160497
92	58	booking_created	\N	waiting_manual_confirmation	\N	unpaid	\N	58	{"departure_at": "2026-07-14T19:00:00.000Z", "final_amount": "1500", "payment_method": "manual", "passenger_count": 1, "payment_required": true}	2026-07-01 23:14:09.431833
93	59	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-29T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 4, "payment_required": false}	2026-07-01 23:19:35.489531
94	60	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-13T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 3, "payment_required": false}	2026-07-01 23:26:27.200194
95	58	manual_confirmation_auto_expired	waiting_manual_confirmation	expired	unpaid	failed	Manual payment confirmation window expired	\N	{}	2026-07-02 00:01:00.48519
96	61	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-04T01:00:00.000Z", "final_amount": "2500", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-02 14:41:40.970968
97	56	booking_cancel_requested	confirmed	cancel_pending	paid	paid	nghèo hết tiền	58	{"payment_id": 36, "refund_amount": 3532, "refund_percent": 100, "refund_request_id": 11}	2026-07-02 14:51:50.042985
98	56	manual_refund_approved	cancel_pending	canceled	paid	paid	Approve Refund Request	2	{"payment_id": 36, "refund_amount": "3532.00", "refund_request_id": 11}	2026-07-02 14:53:43.9381
99	61	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-07-02 15:27:02.234886
100	62	booking_created	\N	confirmed	\N	paid	\N	55	{"departure_at": "2026-07-02T19:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 1, "payment_required": false}	2026-07-02 23:09:14.762649
101	63	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-30T02:00:00.000Z", "final_amount": "3975", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-07-19 22:24:01.622641
102	63	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 38, "sepay_transaction_id": "69024120"}	2026-07-19 22:28:46.491227
103	64	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-22T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 03:17:35.005451
104	65	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 13:46:43.747006
105	65	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 39, "sepay_transaction_id": "69097948"}	2026-07-20 13:47:08.160023
106	65	booking_cancel_requested	confirmed	cancel_pending	paid	paid	không đi nữa	57	{"payment_id": 39, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 12}	2026-07-20 13:49:35.636253
107	65	manual_refund_rejected	cancel_pending	confirmed	paid	paid	...	4	{"payment_id": 39, "refund_amount": "3000.00", "refund_request_id": 12}	2026-07-20 13:50:23.376877
108	65	booking_cancel_requested	confirmed	cancel_pending	paid	paid	sdfg	57	{"payment_id": 39, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 13}	2026-07-20 13:50:56.711069
109	65	manual_refund_approved	cancel_pending	canceled	paid	paid	oke	4	{"payment_id": 39, "refund_amount": "3000.00", "refund_request_id": 13}	2026-07-20 13:51:17.844299
110	65	manual_refund_completed	canceled	canceled	paid	refunded	qưerty	4	{"payment_id": 39, "refund_amount": "3000.00", "transaction_code": "123456", "refund_request_id": 13}	2026-07-20 13:51:48.315447
111	66	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-20T19:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 14:00:49.036692
112	66	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 40, "sepay_transaction_id": "69099778"}	2026-07-20 14:01:34.272577
113	67	booking_created	\N	pending	\N	unpaid	\N	55	{"departure_at": "2026-07-21T02:00:00.000Z", "final_amount": "2000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-20 14:04:49.636184
114	67	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 41, "sepay_transaction_id": "69100292"}	2026-07-20 14:05:38.67893
115	68	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-23T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 16:22:37.700138
116	68	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 42, "sepay_transaction_id": "69120531"}	2026-07-20 16:23:10.337519
117	69	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-24T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 01:26:33.332753
118	70	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 01:32:13.597843
119	70	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 43, "sepay_transaction_id": "69198764"}	2026-07-21 01:33:01.161866
120	71	booking_created	\N	pending	\N	unpaid	\N	55	{"departure_at": "2026-07-21T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-21 01:34:55.762299
121	72	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 01:38:34.660488
122	72	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 45, "sepay_transaction_id": "69198929"}	2026-07-21 01:39:03.75847
123	71	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-07-21 01:50:44.164436
124	64	booking_auto_expired	pending	expired	unpaid	failed	Unpaid booking expired automatically	\N	{}	2026-07-21 02:31:19.332881
125	73	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 15:41:18.080933
126	73	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-07-21 15:57:56.564368
127	70	booking_cancel_requested	confirmed	cancel_pending	paid	paid	\N	58	{"payment_id": 43, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 14}	2026-07-21 15:58:11.016816
128	70	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	\N	58	{"payment_id": 43, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 14}	2026-07-21 15:58:16.714632
129	74	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-22T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 16:10:34.02564
130	74	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 47, "sepay_transaction_id": "69283270"}	2026-07-21 16:11:58.755153
\.


--
-- Data for Name: pre_normalize_20260722_000005__coupon; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__coupon (coupon_id, code, name, description, discount_type, discount_value, max_discount_amount, min_order_amount, usage_limit, used_count, start_date, end_date, status, created_by, created_at, updated_at, deleted_at, archived_at) FROM stdin;
8	SUMMER40	Summer Discount	40% discount for summer tours	percentage	40	100000	500000	100	0	2026-06-01	2026-06-30	active	2	2026-06-20 14:21:17.851534	2026-06-20 14:21:17.851534	\N	\N
3	TEST1780281209397	Temporary Coupon Test	soft deleted after smoke test	percentage	10	50000	100000	6	0	2026-06-01	2026-06-30	inactive	9	2026-06-01 02:33:25.701876	2026-06-01 02:33:26.203888	\N	\N
5	SUMMER30	Summer Discount Updated	string	percentage	15	5000	0	150	2	2026-06-01	2026-07-07	inactive	2	2026-06-01 02:36:55.1853	2026-06-20 13:44:06.609363	\N	\N
1	SUMMER20	Summer Discount	20% discount for summer tours	percentage	20	100000	500000	100	0	2026-06-01	2026-06-30	archived	2	2026-05-30 13:58:46.352903	2026-06-24 07:43:53.457955	\N	2026-06-24 07:43:53.457955
10	SALE99	GIẢM 99%		percentage	99	1000000	4000	10	2	2026-06-25	2026-08-30	active	2	2026-06-29 14:32:49.204433	2026-06-29 19:47:38.576706	\N	\N
11	SALE100	GIẢM 100%		percentage	100	1000000000	1000	10	7	2026-06-25	2026-10-01	active	2	2026-06-29 20:23:16.729489	2026-07-02 23:09:14.762649	\N	\N
9	SALE50	GIẢM 50	TEST	percentage	50	10000000	1	50	6	2026-06-23	2026-07-31	active	2	2026-06-24 07:43:24.015368	2026-07-21 16:11:58.755153	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__destination_category; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__destination_category (destination_category_id, name, description, created_at, updated_at) FROM stdin;
4	Sinh thái		2026-06-10 14:23:37.68577	2026-06-10 14:23:37.68577
1	Lịch Sử	Updated destination category description	2026-05-21 14:07:04.702614	2026-05-21 14:07:04.702614
\.


--
-- Data for Name: pre_normalize_20260722_000005__email_verification_tokens; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__email_verification_tokens (verification_id, user_id, token_hash, expires_at, used_at, created_at) FROM stdin;
1	4	79251028c2a8a12dc7576842397b1c0973f91375eeb03173c4c74c86cbc21fd1	2026-05-27 13:45:09.18	2026-05-27 06:31:13.665692	2026-05-27 06:30:09.191439
15	49	83a7229dd4f8f8fd51a16293f970e865fec03cdb590b3039be3606fd7245a5ea	2026-06-23 18:34:16.115	\N	2026-06-23 18:19:16.196352
16	50	fc5932c200f3e53944f0a9a317145346a90a68e4ad570f538de07736b108674c	2026-06-23 18:35:10.124	2026-06-23 18:20:37.798384	2026-06-23 18:20:10.202243
17	51	64c9fc5eda14b98683f0e92268d70304aeab73d6a7484e7d0a57fa993213421b	2026-06-23 19:11:17.289	2026-06-23 18:56:55.805323	2026-06-23 18:56:17.380407
20	56	cb4573ba1151aaa938786ab521f7cdc96b8f56b56835ce7ddf0362e021a264c3	2026-06-24 07:15:02.933	2026-06-24 07:00:40.018656	2026-06-24 07:00:03.01784
21	60	42a71fcec1cb4d91c9adff57f15b6ed5444126ede2d2669efd8b50831801fcd9	2026-07-18 22:59:35.825	2026-07-18 22:46:31.455824	2026-07-18 22:44:29.773397
22	63	7fd97c30f92733d676726f3eb715f6733157e8d625fdbf4d4b95ed9ab686df3b	2026-07-20 19:36:39.963	2026-07-21 02:39:03.432108	2026-07-21 02:21:40.05441
23	63	2427573beba4968939c53dfc74b49714fa0168aab66b471d6bd38878f5498916	2026-07-20 19:54:03.528	2026-07-21 02:43:00.616096	2026-07-21 02:39:03.621614
25	63	c51b2b7b3945ade3d2a1ea257893e045d4f28401abfa0d88613c706189c76b27	2026-07-21 03:02:06.835227	2026-07-21 02:47:25.215363	2026-07-21 02:47:06.835227
\.


--
-- Data for Name: pre_normalize_20260722_000005__group_trip; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__group_trip (group_trip_id, booking_id, name, visibility, leader_id, created_by, status, created_at, updated_at, description, destination_id, destination_name, start_date, end_date, max_members, deleted_at) FROM stdin;
2	\N	Bến Ninh Kiều	private	50	50	active	2026-07-20 02:57:34.974109	2026-07-20 02:57:34.974109	Đẹp	7	\N	2026-07-22	2026-07-23	2	\N
1	\N	FPT UNIVERSITY	public	58	58	active	2026-07-18 15:54:40.287037	2026-07-20 10:59:31.491535	\N	3	\N	2026-07-17	2026-07-19	20	\N
4	\N	TEST	public	58	58	active	2026-07-20 11:09:52.699401	2026-07-20 11:10:09.335914	\N	3	\N	2026-07-20	2026-07-22	10	\N
5	\N	Cần Thơ	public	55	55	active	2026-07-20 13:05:29.570756	2026-07-20 13:21:39.036689	\N	6	\N	2026-07-25	2026-07-26	8	\N
6	\N	inter3	private	62	57	active	2026-07-20 13:10:35.213544	2026-07-20 15:02:47.820943	inter3	7	\N	2026-07-22	2026-07-24	3	2026-07-20 15:02:47.820943
7	\N	hjkbhk	public	50	50	active	2026-07-20 16:00:50.461632	2026-07-20 16:01:52.386477	gtvybguhn	7	\N	2026-07-21	2026-07-22	3	\N
10	\N	APP TEST INVITATIONS	public	60	60	active	2026-07-21 14:38:32.713284	2026-07-21 14:38:32.713284	\N	2	\N	2026-07-25	2026-07-31	31	\N
8	\N	TESSTT	private	58	58	archived	2026-07-20 16:29:18.827346	2026-07-21 14:45:57.117709	FDHFDH	7	\N	2026-07-29	2026-07-31	222	\N
9	\N	APP TEST	public	58	58	active	2026-07-21 14:28:27.769924	2026-07-21 14:49:23.649788		7	Đại Học FPT Cần Thơ	2026-07-25	2026-07-31	30	\N
11	\N	TEST FPT	public	58	58	active	2026-07-21 16:18:01.644354	2026-07-21 16:20:56.692737	\N	7	Đại Học FPT Cần Thơ	2026-07-22	2026-07-26	20	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__group_trip_invite; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__group_trip_invite (group_trip_invite_id, group_trip_id, invited_user_id, invited_email, invited_by, token_hash, status, expires_at, accepted_at, canceled_at, created_at, declined_at) FROM stdin;
1	1	60	phamvanhoaifpt@gmail.com	58	f8589d7a63644c437512f14dfa68179616e8b62977431c0c6b6dc561df60e489	declined	2026-07-25 22:47:20.623	\N	\N	2026-07-18 22:47:13.928785	2026-07-18 23:08:55.081455
2	1	60	phamvanhoaifpt@gmail.com	58	89372e5eb4ad5c25dc684c51f2ce618d30b0d373d9111ae0d3320e489698942b	canceled	2026-07-25 23:11:07.355	\N	2026-07-18 23:19:19.492179	2026-07-18 23:11:00.68346	\N
3	1	60	phamvanhoaifpt@gmail.com	58	97d4e93c94a5ad03dc7cd9e6a2dc0fed05062d59011846ab403534776f8c1688	accepted	2026-07-25 23:20:05.076	2026-07-18 23:25:23.011992	\N	2026-07-18 23:19:58.401071	\N
4	5	57	duongncce180374@fpt.edu.vn	55	b29551a48c596895676f2836e8930b80807e5c75632d684b508ef7e67fed158c	pending	2026-07-27 06:10:21.567	\N	\N	2026-07-20 13:10:20.545562	\N
5	6	55	khoaldce181030@fpt.edu.vn	57	582154be1821e175d1300b764a039ae79a0d74fc880b24c15010eeeba23c80ee	canceled	2026-07-27 06:12:54.458	\N	2026-07-20 13:17:44.513053	2026-07-20 13:12:53.464136	\N
6	6	55	khoaldce181030@fpt.edu.vn	57	58c891ec6d2e09e8c40b6bc5b3cb5b6d515c07269033b7df536ea08966a680ef	accepted	2026-07-27 06:30:41.86	2026-07-20 13:31:06.808857	\N	2026-07-20 13:30:40.877107	\N
7	6	55	khoaldce181030@fpt.edu.vn	57	acda3c552cd8440ed7e3ff3c335259f6f2032f81eb1780f366c7c0dcc82fec5a	pending	2026-07-27 06:32:00.676	\N	\N	2026-07-20 13:31:59.676623	\N
8	6	62	hoantncs180622@fpt.edu.vn	57	76c84c46c508abe7bd91887f967a7ca416c12c9f5a95c54223cf4455c97efc82	accepted	2026-07-27 06:38:07.652	2026-07-20 13:38:57.355411	\N	2026-07-20 13:38:06.707787	\N
9	6	57	duongncce180374@fpt.edu.vn	62	690d88bcc4368c4e089ec67ce50b099e99abf9135e68891d5ec53d385521469e	accepted	2026-07-27 06:41:20.293	2026-07-20 13:43:09.101533	\N	2026-07-20 13:41:19.313407	\N
10	5	61	ledangkhoadz@gmail.com	55	c224469d3de03c1b91068c21408173abc02a2c6fe521a928077ecc812c3a577d	canceled	2026-07-27 08:26:10.569	\N	2026-07-20 15:26:57.349286	2026-07-20 15:26:09.598206	\N
11	5	61	ledangkhoadz@gmail.com	55	74c0775a14302f71b6ade2b803b406dcba9cb9fe4beb134ea0fe60fa676de9c1	pending	2026-07-27 08:28:01.373	\N	\N	2026-07-20 15:28:00.398188	\N
12	7	57	duongncce180374@fpt.edu.vn	50	64d12b86488221e77c1c0f321f3477f9e0d64c0dedd21b3eac2e74daf0d20c0c	accepted	2026-07-27 09:01:34.041	2026-07-20 16:01:52.386477	\N	2026-07-20 16:01:33.071864	\N
14	10	58	hoaipv.work@gmail.com	60	1d8fde7c6fce80e31ea5387496717df560fe324f5618686d43f8d8fd2cda5ff5	pending	2026-07-28 07:38:54.837	\N	\N	2026-07-21 14:38:53.88794	\N
13	9	60	phamvanhoaifpt@gmail.com	58	f283b647b253649bd37e351622d6a0cc00ead1c6b2c4bedc4fca426657904a51	canceled	2026-07-28 07:35:04.223	\N	2026-07-21 14:46:55.494325	2026-07-21 14:35:03.237437	\N
15	9	60	phamvanhoaifpt@gmail.com	58	dff525cd09885641cb888028c39873e518808cd4354f625626e0fa2056ed0abd	accepted	2026-07-28 07:47:40.746	2026-07-21 14:47:48.187991	\N	2026-07-21 14:47:39.791539	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__group_trip_itinerary_item; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__group_trip_itinerary_item (itinerary_item_id, group_trip_id, itinerary_date, start_time, title, description, location_id, custom_location, order_index, created_at, updated_at, latitude, longitude) FROM stdin;
2	1	2026-07-18	15:41:00	Cổng Bến Nhà Rồng	\N	\N	Cổng Bến Nhà Rồng	1	2026-07-18 16:42:05.115011	2026-07-18 17:15:35.995391	10.7680810	106.7061390
1	1	2026-07-18	19:31:00	Trường Đại học FPT Cần Thơ	\N	\N	Trường Đại học FPT Cần Thơ	1	2026-07-18 16:31:56.816845	2026-07-18 17:15:51.939944	10.0130910	105.7317140
3	5	2026-07-25	08:00:00	Đi Chơi	\N	1	\N	2	2026-07-20 13:08:39.140793	2026-07-20 13:19:47.362395	\N	\N
4	5	2026-07-25	13:00:00	Đi Chơi	\N	8	\N	1	2026-07-20 13:19:09.776637	2026-07-20 13:21:39.036689	\N	\N
5	9	2026-07-25	14:40:00	Cổng	\N	7	\N	1	2026-07-21 14:41:11.715043	2026-07-21 14:41:11.715043	\N	\N
6	9	2026-07-26	20:30:00	Tham Quan Gamma	\N	4	\N	1	2026-07-21 14:43:46.424223	2026-07-21 14:43:46.424223	\N	\N
7	11	2026-07-22	16:20:00	Gamma	\N	7	\N	1	2026-07-21 16:20:10.482004	2026-07-21 16:20:10.482004	\N	\N
8	11	2026-07-23	18:20:00	Alpha	\N	8	\N	1	2026-07-21 16:20:56.50836	2026-07-21 16:20:56.50836	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__group_trip_member; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__group_trip_member (group_trip_member_id, group_trip_id, user_id, role, status, joined_at, left_at, removed_at, removed_by) FROM stdin;
2	1	60	member	active	2026-07-18 23:25:23.011992	\N	\N	\N
1	1	58	leader	active	2026-07-18 15:54:40.287037	\N	\N	\N
3	2	50	leader	active	2026-07-20 02:57:34.974109	\N	\N	\N
5	4	58	leader	active	2026-07-20 11:09:52.699401	\N	\N	\N
6	5	55	leader	active	2026-07-20 13:05:29.570756	\N	\N	\N
8	6	55	member	removed	2026-07-20 13:31:06.808857	\N	2026-07-20 13:31:38.052639	57
9	6	62	leader	active	2026-07-20 13:38:57.355411	\N	\N	\N
7	6	57	member	active	2026-07-20 13:43:09.101533	\N	\N	\N
11	7	50	leader	active	2026-07-20 16:00:50.461632	\N	\N	\N
12	7	57	member	active	2026-07-20 16:01:52.386477	\N	\N	\N
13	8	58	leader	active	2026-07-20 16:29:18.827346	\N	\N	\N
14	9	58	leader	active	2026-07-21 14:28:27.769924	\N	\N	\N
15	10	60	leader	active	2026-07-21 14:38:32.713284	\N	\N	\N
16	9	60	member	active	2026-07-21 14:47:48.187991	\N	\N	\N
17	11	58	leader	active	2026-07-21 16:18:01.644354	\N	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__location; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__location (location_id, name, latitude, longitude, description, destination_id, created_at, updated_at, thumbnail, deleted_at, is_deleted) FROM stdin;
2	test system update	10.777	106.695	Updated description	2	2026-05-27 06:55:26.907004	2026-05-27 06:56:49.214091	https://example.com/new-image.jpg	2026-05-27 06:56:49.214091	t
7	Giới Thiệu	10.013091	105.731714	Toạ lạc tại số 600 Nguyễn Văn Cừ nối dài, TP Cần Thơ, Trường Đại học FPT trở thành một không gian học tập chuẩn quốc tế dành cho sinh viên ngay tại Đồng bằng Sông Cửu Long với các nhóm ngành Công Nghệ Thông Tin, Quản trị kinh doanh, Công nghệ Truyền thông, Luật và Ngôn ngữ. Với phương châm Trải nghiệm để thành công, Trường Đại học FPT tự hào mang đến cho sinh viên một môi trường học tập đa trải nghiệm với 3 trụ cột chính Công nghệ, Quốc tế và Khởi nghiệp, cung cấp cho thị trường lao động nguồn nhân lực chất lượng cao, sở hữu đầy đủ các phẩm chất cần thiết từ kiến thức chuyên môn, kỹ năng mềm đến tư duy công nghệ và thái độ chuyên nghiệp trong công việc.	7	2026-06-24 07:45:57.316679	2026-07-01 21:48:52.920449	\N	\N	f
4	Tòa Gamma	10.012885	105.730807	Tòa nhà Gamma là một trong những công trình trọng điểm thuộc phân hiệu Trường Đại học FPT Cần Thơ (địa chỉ: Số 600 đường Nguyễn Văn Cừ nối dài, Phường An Bình, Quận Ninh Kiều, TP. Cần Thơ).	7	2026-06-02 15:19:36.554911	2026-07-01 22:05:49.725622	https://s3.cloudfly.vn/travellens/locations/1781623977782-0e04e76aedce4acc383c256e9fb7418c.jpg	\N	f
6	xcbxcxzbz	34643	346346	xcbcx	3	2026-06-16 13:58:15.95271	2026-06-16 14:11:36.64089	\N	2026-06-16 14:11:36.64089	t
5	Cổng Trời	10.777	106.695	Main entrance of FreeFire	3	2026-06-02 16:31:23.516335	2026-07-05 20:37:51.198616	https://s3.cloudfly.vn/travellens/travel-feed/1783258673881-1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	\N	f
8	Tòa Alpha ĐH fpt cần thơ	10.013772	105.731805	Tòa nhà hiệu bộ Alpha tại campus Cần Thơ có tổng diện tích sàn xây dựng gần 25.000 m2. Kết cấu gồm 1 tầng bán hầm, 9 tầng nổi và tum thang có mái che. Công trình có kiến trúc mặt đứng, thiết kế đồng điệu với tổng thể các tòa nhà khác và lấy ý tưởng chính từ họa tiết Penrose.\r\n\r\nQuy mô gồm 136 phòng học và phòng chức năng, đáp ứng nhu cầu học tập và sinh hoạt của hơn 5.000 cán bộ, giáo viên, sinh viên. Tòa nhà được kỳ vọng sẽ góp phần giúp nhà trường thực hiện tốt sứ mệnh cung cấp nguồn nhân lực số nhạy bén với cuộc cách mạng 4.0, giỏi về khoa học - công nghệ, qua đó cung ứng nguồn lao động chất lượng cao cho Đồng bằng sông Cửu Long.	7	2026-07-20 09:44:48.827633	2026-07-20 09:44:48.827633	\N	\N	f
1	Cổng Dinh Độc Lập	10.777931	106.696295	Main entrance of Dinh Doc Lap	2	2026-05-25 14:10:47.810152	2026-06-23 19:56:06.358272	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	\N	f
3	Cổng Bến Nhà Rồng	10.768081	106.706139	Main entrance of Bến Nhà Rồng	3	2026-06-01 02:39:44.820265	2026-06-23 19:56:57.3134	https://s3.cloudfly.vn/travellens/locations/1782244304175-ben-nha-rong.jpg	\N	f
\.


--
-- Data for Name: pre_normalize_20260722_000005__map; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__map (map_id, location_id, map_file, description, title, display_order, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
3	1	/public/maps/1779806116307-Screenshot-2026-05-22-212357.png	\N	Ground Floor firts Map	1	2026-05-26 14:45:38.63074	2026-05-26 15:37:20.375993	2026-05-26 15:37:20.375993	t
4	1	/public/maps/1779810142181-Screenshot-2026-03-15-212619.png	final test update	duong	2	2026-05-26 15:42:21.405882	2026-05-26 15:44:24.820618	2026-05-26 15:44:24.820618	t
5	1	/public/maps/1779810494214-Screenshot-2026-03-16-073932.png	Ground floor layout	test	1	2026-05-26 15:48:13.39777	2026-05-26 15:48:38.093523	2026-05-26 15:48:38.093523	t
6	1	/public/maps/1779865182506-Screenshot-2026-03-16-210951.png	no	test update map	2	2026-05-27 06:59:42.580568	2026-05-27 07:01:35.743387	2026-05-27 07:01:35.743387	t
1	1	https://s3.cloudfly.vn/travellens/maps/1782200478667-dinhdoclap738-mbws-vn-dinhdoclap-gov-vn-google-trang-t-nh-3.png	Updated layout	Ground Floor Updated	1	2026-05-26 14:45:38.63074	2026-06-23 07:41:21.673936	\N	f
2	1	/public/maps/1779808659493-Screenshot-2026-05-20-142142.png		NCD	2	2026-05-26 14:45:38.63074	2026-06-23 07:43:54.387548	2026-06-23 07:43:54.387548	t
7	4	/public/maps/1780413974094-Screenshot-2026-06-01-170758.png	Updated layout	Alpha	2	2026-06-02 15:26:13.704762	2026-06-23 07:44:23.380766	2026-06-23 07:44:23.380766	t
9	3	https://s3.cloudfly.vn/travellens/maps/1782234891968-tham-quan-ben-nha-rong-di-lai-min.png	Bến 1 có 3 tàu lớn và 3 tàu nhỏ	Bến 1	0	2026-06-23 17:14:54.352239	2026-06-23 17:15:36.247671	2026-06-23 17:15:36.247671	t
10	1	https://s3.cloudfly.vn/travellens/maps/1782285192642-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	1237	Cổng A	\N	2026-06-24 07:11:18.501771	2026-06-24 07:13:58.31443	\N	f
8	4	https://s3.cloudfly.vn/travellens/maps/1784516989644-map.jpg		test	\N	2026-06-23 07:18:51.42382	2026-07-20 10:09:51.542745	\N	f
\.


--
-- Data for Name: pre_normalize_20260722_000005__media_file; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__media_file (media_id, uploaded_by, original_name, file_name, file_url, mime_type, file_size, created_at, updated_at, deleted_at) FROM stdin;
1	2	Createbookingt.drawio.png	1782124132690-Createbookingt-drawio.png	https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png	image/png	357138	2026-06-22 10:28:55.445017	2026-06-22 10:28:55.445017	\N
2	2	The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	image/jpeg	178810	2026-06-23 09:03:17.313228	2026-06-23 09:03:17.313228	\N
3	2	Delete review.drawio.png	1782214256372-Delete-review-drawio.png	https://s3.cloudfly.vn/travellens/media/1782214256372-Delete-review-drawio.png	image/png	262670	2026-06-23 11:30:59.016502	2026-06-23 11:30:59.016502	\N
4	2	PaymentStatusUpdate.drawio.png	1782214382526-PaymentStatusUpdate-drawio.png	https://s3.cloudfly.vn/travellens/media/1782214382526-PaymentStatusUpdate-drawio.png	image/png	74572	2026-06-23 11:33:04.507028	2026-06-23 11:33:04.507028	\N
5	2	truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	https://s3.cloudfly.vn/travellens/media/1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	image/jpeg	1614883	2026-06-23 19:46:22.394561	2026-06-23 19:46:22.394561	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__password_reset_codes; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__password_reset_codes (reset_code_id, user_id, code_hash, reset_token_hash, expires_at, verified_at, used_at, created_at) FROM stdin;
1	4	430c49cf700b85e7725f64ee2d39e59dd3ca91f1704048e320b53a2c89d18778	21ccc9f0bacdc9180a2586b3ed4358475aa750f9c186204bcf4b878654ae12fd	2026-05-27 13:57:06.29	2026-05-27 06:47:50.196984	2026-05-27 06:48:18.232206	2026-05-27 06:47:06.289637
9	56	7055b2aa4ba825d931a47f758e2957e1870222dd05d3bbb1a45cdb9788a0adb6	9f943e8c18c556983e81bac8f8cf6d525faeaba73677a92f27364e5eaa2f1773	2026-06-24 07:12:00.133	2026-06-24 07:02:19.71362	2026-06-24 07:02:33.456931	2026-06-24 07:02:00.217367
11	57	fb9365a5414721f05ba471a9e579fe71260f8d9308bb99b74236fe9119a9bc43	\N	2026-06-29 08:39:46.56	\N	\N	2026-06-29 15:29:46.64939
10	57	4a5288faa8de11ace63a74c48c1c7f0e33c479a3029454fe59c9140cc9f89268	309dec100a68a6c7ae1e943d59267c949692578510a8f442adb1062da1041c59	2026-06-29 15:37:33.983	2026-06-29 15:30:57.028748	2026-06-29 15:32:24.377506	2026-06-29 15:27:34.403919
12	60	dd49b4bfcc94ae1a6d9f305c691e5ac41ecfcd5934df728d84109f3d30fb6d86	9fb7a24edae3b6b1067ddcd72a9f84821ecde80cac2c47215c48c6a6a7edd259	2026-07-21 16:04:33.346837	2026-07-21 15:55:02.925933	2026-07-21 15:55:15.054702	2026-07-21 15:54:33.346837
\.


--
-- Data for Name: pre_normalize_20260722_000005__payment; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__payment (payment_id, booking_id, amount, payment_method, payment_date, status, transaction_code, currency, payment_code, payment_provider, sepay_transaction_id, bank_account, transfer_content, paid_at, expired_at, created_at, updated_at, deleted_at) FROM stdin;
2	7	8500	bank_transfer	\N	paid	FT26152540980426	VND	TVL00000798EB92	sepay	61401120	6511223344	131564661280-TVL00000798EB92-CHUYEN TIEN-OQCH000Ch0ia-MOMO131564661280MOMO	2026-06-01 17:16:00	2026-06-01 17:31:12.865	2026-06-01 10:16:09.067709	2026-06-01 10:24:20.916449	\N
3	8	5950	bank_transfer	\N	paid	FT26153909675060	VND	TVL0000084AE6AC	sepay	61551766	6511223344	131711831923-TVL0000084AE6AC-CHUYEN TIEN-OQCH000Cknap-MOMO131711831923MOMO	2026-06-02 17:35:00	2026-06-02 10:48:44.867	2026-06-02 10:33:44.033965	2026-06-02 10:35:08.745956	\N
5	10	2000	bank_transfer	\N	paid	FT26154072156190	VND	TVL00001034C584	sepay	61595096	6511223344	131753592440-TVL00001034C584-CHUYEN TIEN-OQCH000Cm3pW-MOMO131753592440MOMO	2026-06-02 22:37:00	2026-06-02 15:49:51.951	2026-06-02 15:34:51.111612	2026-06-02 15:37:29.915624	\N
4	9	360	bank_transfer	\N	expired	\N	VND	TVL0000093162B0	sepay	\N	6511223344	TVL0000093162B0	\N	2026-06-02 15:46:41.771	2026-06-02 15:31:40.921577	2026-06-02 16:25:56.42968	\N
6	18	3000	bank_transfer	\N	expired	\N	VND	TVL00001830B0AA	sepay	\N	6511223344	TVL00001830B0AA	\N	2026-06-24 18:59:48.877	2026-06-24 18:44:48.08023	2026-06-24 18:46:23.203736	\N
7	19	3000	bank_transfer	\N	paid	FT26176508048684	VND	TVL000019FF0F1B	sepay	64902587	6511223344	134805249220-TVL000019FF0F1B-CHUYEN TIEN-OQCH000EGDZN-MOMO134805249220MOMO	2026-06-25 01:47:00	2026-06-24 19:02:03.633	2026-06-24 18:47:02.821753	2026-06-24 18:47:41.490357	\N
9	21	3532	bank_transfer	\N	paid	FT26176098407160	VND	TVL0000210F6C27	sepay	64903150	6511223344	134805696590-TVL0000210F6C27-CHUYEN TIEN-OQCH000EGE66-MOMO134805696590MOMO	2026-06-25 01:56:00	2026-06-24 19:11:38.945	2026-06-24 18:56:38.139751	2026-06-24 18:56:54.744645	\N
10	22	3000	bank_transfer	\N	paid	FT26178208683147	VND	TVL000022FE9595	sepay	65364513	6511223344	135166597124-TVL000022FE9595-CHUYEN TIEN-OQCH000ERr3O-MOMO135166597124MOMO	2026-06-27 19:51:00	2026-06-27 13:05:49.431	2026-06-27 12:50:48.608913	2026-06-27 12:51:13.909989	\N
11	23	3000	bank_transfer	\N	paid	FT26178950257184	VND	TVL000023C630B5	sepay	65366122	6511223344	135167887857-TVL000023C630B5-CHUYEN TIEN-OQCH000ERuGy-MOMO135167887857MOMO	2026-06-27 20:01:00	2026-06-27 13:16:28.993	2026-06-27 13:01:28.182263	2026-06-27 13:01:50.084087	\N
12	24	3532	bank_transfer	\N	paid	FT26178737117222	VND	TVL00002460ECA7	sepay	65368917	6511223344	135170335687-TVL00002460ECA7-CHUYEN TIEN-OQCH000ERzbk-MOMO135170335687MOMO	2026-06-27 20:19:00	2026-06-27 13:33:54.405	2026-06-27 13:18:53.610069	2026-06-27 13:19:10.433041	\N
13	25	2500	bank_transfer	\N	paid	FT26180400499706	VND	TVL00002529220F	sepay	65626271	6511223344	135384837172-TVL00002529220F-CHUYEN TIEN-OQCH000EYldB-MOMO135384837172MOMO	2026-06-29 14:34:00	2026-06-29 07:49:18.314	2026-06-29 14:34:17.519113	2026-06-29 14:34:37.762009	\N
8	20	240000	bank_transfer	\N	expired	\N	VND	TVL000020377027	sepay	\N	6511223344	TVL000020377027	\N	2026-06-24 19:10:07.955	2026-06-24 18:55:07.092142	2026-06-29 15:22:01.697084	\N
14	30	250000	bank_transfer	\N	expired	\N	VND	TVL0000302D7B72	sepay	\N	6511223344	TVL0000302D7B72	\N	2026-06-29 09:23:19.648	2026-06-29 16:08:18.843319	2026-06-29 16:09:01.206972	\N
15	31	3000	bank_transfer	\N	refunded	FT26180073593678	VND	TVL000031FE8983	sepay	65648744	6511223344	135400463963-TVL000031FE8983-CHUYEN TIEN-OQCH000EZGmC-MOMO135400463963MOMO	2026-06-29 17:01:00	2026-06-29 17:16:12.151012	2026-06-29 17:01:12.151012	2026-06-29 18:04:38.898635	\N
16	32	3000	bank_transfer	\N	refunded	147852	VND	TVL000032F241B1	sepay	65662559	6511223344	135410719789-TVL000032F241B1-CHUYEN TIEN-OQCH000EZXiM-MOMO135410719789MOMO	2026-06-29 18:11:00	2026-06-29 18:25:43.916176	2026-06-29 18:10:43.916176	2026-06-29 18:39:14.872021	\N
18	34	3000	bank_transfer	\N	paid	FT26180570650167	VND	TVL0000347D0E61	sepay	65670623	6511223344	135417759773-TVL0000347D0E61-CHUYEN TIEN-OQCH000EZm2t-MOMO135417759773MOMO	2026-06-29 18:58:00	2026-06-29 19:12:55.266723	2026-06-29 18:57:55.266723	2026-06-29 18:58:14.586359	\N
19	35	10000	bank_transfer	\N	refunded	432515	VND	TVL0000357CFDBC	sepay	65678882	6511223344	135424628153-TVL0000357CFDBC-CHUYEN TIEN-OQCH000Ea0Q5-MOMO135424628153MOMO	2026-06-29 19:47:00	2026-06-29 20:02:21.47988	2026-06-29 19:47:21.47988	2026-06-29 20:06:48.378527	\N
25	41	3000	bank_transfer	\N	refunded	Request #9 for booking BK-41.	VND	TVL000041B61503	sepay	65692984	6511223344	135435633154-TVL000041B61503-CHUYEN TIEN-OQCH000EaNHG-MOMO135435633154MOMO	2026-06-29 21:14:00	2026-06-29 21:29:32.558247	2026-06-29 21:14:32.558247	2026-06-29 21:30:03.149202	\N
27	43	6000	bank_transfer	\N	paid	FT26181892263970	VND	TVL00004357445B	sepay	65707025	6511223344	135445921323-TVL00004357445B-CHUYEN TIEN-OQCH000EakVL-MOMO135445921323MOMO	2026-06-29 23:10:00	2026-06-29 23:23:08.084097	2026-06-29 23:08:08.084097	2026-06-29 23:10:08.328083	\N
29	45	2475	bank_transfer	\N	paid	FT26181866104884	VND	TVL000045E40657	sepay	65713026	6511223344	135449819136-TVL000045E40657-CHUYEN TIEN-OQCH000EarN8-MOMO135449819136MOMO	2026-06-30 00:16:00	2026-06-30 00:29:34.812524	2026-06-30 00:14:34.812524	2026-06-30 00:16:07.849359	\N
20	36	3000	bank_transfer	\N	expired	\N	VND	TVL00003611AF82	sepay	\N	6511223344	TVL00003611AF82	\N	2026-06-29 20:44:15.659653	2026-06-29 20:29:15.659653	2026-06-30 00:37:31.031646	\N
21	37	3000	bank_transfer	\N	expired	\N	VND	TVL0000377E2149	sepay	\N	6511223344	TVL0000377E2149	\N	2026-06-29 20:59:14.64283	2026-06-29 20:44:14.64283	2026-06-30 00:37:31.031646	\N
22	38	0	bank_transfer	\N	expired	\N	VND	TVL000038FA1676	sepay	\N	6511223344	TVL000038FA1676	\N	2026-06-29 21:26:33.693501	2026-06-29 21:11:33.693501	2026-06-30 00:37:31.031646	\N
23	39	540	bank_transfer	\N	expired	\N	VND	TVL0000396D7F49	sepay	\N	6511223344	TVL0000396D7F49	\N	2026-06-29 21:28:07.393342	2026-06-29 21:13:07.393342	2026-06-30 00:37:31.031646	\N
24	40	750000	bank_transfer	\N	expired	\N	VND	TVL00004044C7AB	sepay	\N	6511223344	TVL00004044C7AB	\N	2026-06-29 21:28:57.778141	2026-06-29 21:13:57.778141	2026-06-30 00:37:31.031646	\N
26	42	3532	bank_transfer	\N	expired	\N	VND	TVL0000426BD784	sepay	\N	6511223344	TVL0000426BD784	\N	2026-06-29 21:45:35.230871	2026-06-29 21:30:35.230871	2026-06-30 00:37:31.031646	\N
28	44	6000	bank_transfer	\N	expired	\N	VND	TVL000044DDB305	sepay	\N	6511223344	TVL000044DDB305	\N	2026-06-29 23:29:19.897008	2026-06-29 23:14:19.897008	2026-06-30 00:37:31.031646	\N
30	46	6900	bank_transfer	\N	expired	\N	VND	TVL000046692CF2	sepay	\N	6511223344	TVL000046692CF2	\N	2026-06-30 00:32:38.680993	2026-06-30 00:17:38.680993	2026-06-30 00:37:31.031646	\N
31	47	5828	bank_transfer	\N	expired	\N	VND	TVL000047B98C4D	sepay	\N	6511223344	TVL000047B98C4D	\N	2026-06-30 00:56:20.419141	2026-06-30 00:41:20.419141	2026-06-30 00:56:44.025246	\N
32	48	4950	bank_transfer	\N	expired	\N	VND	TVL0000483E84C1	sepay	\N	6511223344	TVL0000483E84C1	\N	2026-06-30 01:02:12.140007	2026-06-30 00:58:12.140007	2026-06-30 01:02:15.468519	\N
33	50	4950	bank_transfer	\N	paid	FT26181060321015	VND	TVL00005088303B	sepay	65804297	6511223344	TVL00005088303B I21A8U5Q/775811	2026-06-30 16:15:00	2026-06-30 16:28:15.624381	2026-06-30 16:13:15.624381	2026-06-30 16:15:50.336273	\N
35	53	2914	bank_transfer	\N	paid	FT26181254388808	VND	TVL0000533DE750	sepay	65805714	6511223344	TVL0000533DE750 I21AF22H/848998	2026-06-30 16:24:00	2026-06-30 16:38:48.743624	2026-06-30 16:23:48.743624	2026-06-30 16:24:15.188828	\N
34	51	3532	bank_transfer	\N	expired	\N	VND	TVL0000510F6218	sepay	\N	6511223344	TVL0000510F6218	\N	2026-06-30 16:36:56.942869	2026-06-30 16:21:56.942869	2026-06-30 16:37:12.38838	\N
36	56	3532	bank_transfer	\N	paid	FT26183848005605	VND	TVL0000569D3387	sepay	66040243	6511223344	TVL0000569D3387 I2113JXY/201275	2026-07-01 23:01:00	2026-07-01 23:16:07.210284	2026-07-01 23:01:07.210284	2026-07-01 23:01:27.063091	\N
37	61	2500	bank_transfer	\N	expired	\N	VND	TVL000061EE72CD	sepay	\N	6511223344	TVL000061EE72CD	\N	2026-07-02 14:58:09.08958	2026-07-02 14:43:09.08958	2026-07-02 15:27:02.234886	\N
38	63	3975	bank_transfer	\N	paid	FT26201384209681	VND	TVL00006330B5CF	sepay	69024120	6511223344	138427350059-TVL00006330B5CF-CHUYEN TIEN-OQCH000G2Sqd-MOMO138427350059MOMO	2026-07-19 22:28:00	2026-07-19 22:39:12.893836	2026-07-19 22:24:12.893836	2026-07-19 22:28:46.491227	\N
39	65	3000	bank_transfer	\N	refunded	123456	VND	TVL000065542064	sepay	69097948	6511223344	TVL000065542064	2026-07-20 13:47:00	2026-07-20 14:01:50.764635	2026-07-20 13:46:50.764635	2026-07-20 13:51:48.315447	\N
40	66	3000	bank_transfer	\N	paid	FT26201843237011	VND	TVL000066D4B2A0	sepay	69099778	6511223344	TVL000066D4B2A0	2026-07-20 14:01:00	2026-07-20 14:16:16.039618	2026-07-20 14:01:16.039618	2026-07-20 14:01:34.272577	\N
41	67	2000	bank_transfer	\N	paid	FT26201800228016	VND	TVL00006715BC1D	sepay	69100292	6511223344	IBFT TVL00006715BC1D H2C1LSQN/901129	2026-07-20 14:05:00	2026-07-20 14:19:55.703875	2026-07-20 14:04:55.703875	2026-07-20 14:05:38.67893	\N
42	68	3000	bank_transfer	\N	paid	FT26201099229076	VND	TVL0000688DD813	sepay	69120531	6511223344	138523640262-TVL0000688DD813-CHUYEN TIEN-OQCH000G5BZb-MOMO138523640262MOMO	2026-07-20 16:23:00	2026-07-20 16:37:44.625719	2026-07-20 16:22:44.625719	2026-07-20 16:23:10.337519	\N
43	70	3000	bank_transfer	\N	paid	FT26202911719227	VND	TVL00007079682D	sepay	69198764	6511223344	138585775815-TVL00007079682D-CHUYEN TIEN-OQCH000G7Ld0-MOMO138585775815MOMO	2026-07-21 01:32:00	2026-07-21 01:47:17.545516	2026-07-21 01:32:17.545516	2026-07-21 01:33:01.161866	\N
45	72	3000	bank_transfer	\N	paid	FT26202087091790	VND	TVL000072C4035C	sepay	69198929	6511223344	138585960663-TVL000072C4035C-CHUYEN TIEN-OQCH000G7M0D-MOMO138585960663MOMO	2026-07-21 01:39:00	2026-07-21 01:53:38.721351	2026-07-21 01:38:38.721351	2026-07-21 01:39:03.75847	\N
44	71	3000	bank_transfer	\N	expired	\N	VND	TVL000071AB26DB	sepay	\N	6511223344	TVL000071AB26DB	\N	2026-07-21 01:50:02.546477	2026-07-21 01:35:02.546477	2026-07-21 01:50:44.164436	\N
46	73	3000	bank_transfer	\N	expired	\N	VND	TVL000073120DBF	sepay	\N	6511223344	TVL000073120DBF	\N	2026-07-21 15:56:22.478785	2026-07-21 15:41:22.478785	2026-07-21 15:57:56.564368	\N
47	74	3000	bank_transfer	\N	paid	FT26202631760083	VND	TVL00007453AA56	sepay	69283270	6511223344	138663026258-TVL00007453AA56-CHUYEN TIEN-OQCH000G9VNp-MOMO138663026258MOMO	2026-07-21 16:11:00	2026-07-21 16:25:37.750474	2026-07-21 16:10:37.750474	2026-07-21 16:11:58.755153	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__refund_request; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__refund_request (refund_request_id, booking_id, payment_id, requested_by, reason, refund_amount, status, staff_note, completed_by, completed_at, created_at, updated_at, reviewed_by, reviewed_at) FROM stdin;
1	31	15	57	\N	3000.00	completed	lkjhg	2	2026-06-29 18:04:38.898635	2026-06-29 17:02:49.832827	2026-06-29 18:04:38.898635	2	2026-06-29 18:02:51.497917
2	32	16	57	bị bệnh	3000.00	completed	1485	2	2026-06-29 18:39:14.872021	2026-06-29 18:37:57.279972	2026-06-29 18:39:14.872021	2	2026-06-29 18:39:01.865707
4	34	18	57	hủy	3000.00	rejected	\N	\N	\N	2026-06-29 18:58:44.542474	2026-06-29 19:25:24.005853	2	2026-06-29 19:25:24.005853
5	34	18	57	test	3000.00	rejected	\N	\N	\N	2026-06-29 19:25:57.780972	2026-06-29 19:26:18.936126	2	2026-06-29 19:26:18.936126
7	34	18	57	b n	3000.00	pending	\N	\N	\N	2026-06-29 20:05:00.228502	2026-06-29 20:05:00.228502	\N	\N
6	35	19	57	FGNFG	10000.00	completed	48\n8435	2	2026-06-29 20:06:48.378527	2026-06-29 19:48:15.242993	2026-06-29 20:06:48.378527	2	2026-06-29 20:06:06.608277
8	41	25	57	FDSHH	3000.00	rejected	VCN	\N	\N	2026-06-29 21:15:27.58863	2026-06-29 21:28:49.024266	2	2026-06-29 21:28:49.024266
9	41	25	57	Cancel BK-41. Paid bookings will create a manual refund request for staff to process.	3000.00	completed	Request #9 for booking BK-41.	2	2026-06-29 21:30:03.149202	2026-06-29 21:29:14.379982	2026-06-29 21:30:03.149202	2	2026-06-29 21:29:34.968365
10	53	35	58	test	2914.00	rejected	sdgsdg	\N	\N	2026-07-01 22:45:03.05234	2026-07-01 22:46:00.983694	51	2026-07-01 22:46:00.983694
11	56	36	58	nghèo hết tiền	3532.00	approved	Approve Refund Request	\N	\N	2026-07-02 14:51:50.042985	2026-07-02 14:53:43.9381	2	2026-07-02 14:53:43.9381
12	65	39	57	không đi nữa	3000.00	rejected	...	\N	\N	2026-07-20 13:49:35.636253	2026-07-20 13:50:23.376877	4	2026-07-20 13:50:23.376877
13	65	39	57	sdfg	3000.00	completed	qưerty	4	2026-07-20 13:51:48.315447	2026-07-20 13:50:56.711069	2026-07-20 13:51:48.315447	4	2026-07-20 13:51:17.844299
14	70	43	58	\N	3000.00	pending	\N	\N	\N	2026-07-21 15:58:11.016816	2026-07-21 15:58:11.016816	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__review; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__review (review_id, user_id, location_id, rating, comment, images, date_created, status, created_at, updated_at, deleted_at, booking_id, tour_id) FROM stdin;
1	2	1	5	This location is very beautiful and worth visiting.	\N	2026-05-27	approved	2026-05-27 15:18:56.960026	2026-05-27 15:18:56.960026	\N	\N	\N
3	50	4	4	This location is very beautiful and worth visiting.	\N	2026-06-23	approved	2026-06-23 22:10:44.948214	2026-06-23 22:10:44.948214	\N	\N	\N
2	50	5	3	so beautifull	\N	2026-06-23	pending	2026-06-23 21:38:57.847343	2026-06-23 21:38:57.847343	\N	\N	\N
6	55	\N	5	test	\N	2026-07-02	approved	2026-07-02 23:19:01.859102	2026-07-02 23:19:16.703514	2026-07-02 23:19:16.703514	62	6
7	55	\N	5	ok	\N	2026-07-02	approved	2026-07-02 23:25:03.327259	2026-07-02 23:25:03.327259	\N	62	6
5	55	7	4	sdfghbs	\N	2026-07-02	approved	2026-07-02 22:46:05.841645	2026-07-02 22:46:08.749957	2026-07-02 22:46:08.749957	\N	\N
4	55	7	3	vip	\N	2026-07-02	approved	2026-07-02 22:25:11.192441	2026-07-02 22:44:02.887944	2026-07-02 22:44:02.887944	\N	\N
8	58	8	5	Đẹp, sạch sẽ, hiện đại,..	\N	2026-07-20	approved	2026-07-20 20:16:26.221441	2026-07-20 20:16:26.221441	\N	\N	\N
9	58	\N	5	ok	\N	2026-07-21	approved	2026-07-21 01:49:51.041638	2026-07-21 02:01:43.604712	\N	60	2
10	58	\N	5	ok	\N	2026-07-21	approved	2026-07-21 02:03:29.943244	2026-07-21 02:03:29.943244	\N	53	4
\.


--
-- Data for Name: pre_normalize_20260722_000005__review_photo; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__review_photo (photo_id, review_id, photo_url, original_name, mime_type, file_size, created_at, deleted_at) FROM stdin;
1	1	/public/reviews/1779895714183-screenshot_1773716998.png	screenshot_1773716998.png	image/png	247365	2026-05-27 15:28:34.410547	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__revoked_tokens; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__revoked_tokens (revoked_token_id, token_hash, user_id, expires_at, revoked_at) FROM stdin;
1	a7018548c2f1117f042818f25d3e4d995563a35ef0a32987945138362838512b	4	2026-06-03 13:46:06	2026-05-27 06:46:28.447271
\.


--
-- Data for Name: pre_normalize_20260722_000005__saved_destination; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__saved_destination (user_id, destination_id, created_at) FROM stdin;
51	8	2026-07-01 15:35:35.654973+07
2	8	2026-07-19 23:51:33.001582+07
2	7	2026-07-20 16:25:39.153566+07
58	8	2026-07-21 03:04:10.212904+07
\.


--
-- Data for Name: pre_normalize_20260722_000005__saved_tour; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__saved_tour (user_id, tour_id, created_at) FROM stdin;
59	6	2026-07-18 23:26:17.966467+07
\.


--
-- Data for Name: pre_normalize_20260722_000005__sepay_webhook_log; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__sepay_webhook_log (sepay_webhook_log_id, sepay_transaction_id, payment_id, payment_code, transfer_amount, transfer_type, raw_payload, status, message, created_at) FROM stdin;
1	61401120	2	TVL00000798EB92	8500	in	{"id": 61401120, "code": "TVL00000798EB92", "content": "131564661280-TVL00000798EB92-CHUYEN TIEN-OQCH000Ch0ia-MOMO131564661280MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 131564661280-TVL00000798EB92-CHUYEN TIEN-OQCH000Ch0ia-MOMO131564661280MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26152540980426", "transferAmount": 8500, "transactionDate": "2026-06-01 17:16:00"}	processed	Payment marked as paid	2026-06-01 10:24:20.916449
5	61551766	3	TVL0000084AE6AC	5950	in	{"id": 61551766, "code": "TVL0000084AE6AC", "content": "131711831923-TVL0000084AE6AC-CHUYEN TIEN-OQCH000Cknap-MOMO131711831923MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 131711831923-TVL0000084AE6AC-CHUYEN TIEN-OQCH000Cknap-MOMO131711831923MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26153909675060", "transferAmount": 5950, "transactionDate": "2026-06-02 17:35:00"}	processed	Payment marked as paid	2026-06-02 10:35:08.745956
6	61595096	5	TVL00001034C584	2000	in	{"id": 61595096, "code": "TVL00001034C584", "content": "131753592440-TVL00001034C584-CHUYEN TIEN-OQCH000Cm3pW-MOMO131753592440MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 131753592440-TVL00001034C584-CHUYEN TIEN-OQCH000Cm3pW-MOMO131753592440MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26154072156190", "transferAmount": 2000, "transactionDate": "2026-06-02 22:37:00"}	processed	Payment marked as paid	2026-06-02 15:37:29.915624
7	64902587	7	TVL000019FF0F1B	3000	in	{"id": 64902587, "code": "TVL000019FF0F1B", "content": "134805249220-TVL000019FF0F1B-CHUYEN TIEN-OQCH000EGDZN-MOMO134805249220MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 134805249220-TVL000019FF0F1B-CHUYEN TIEN-OQCH000EGDZN-MOMO134805249220MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26176508048684", "transferAmount": 3000, "transactionDate": "2026-06-25 01:47:00"}	processed	Payment marked as paid	2026-06-24 18:47:41.490357
8	64903150	9	TVL0000210F6C27	3532	in	{"id": 64903150, "code": "TVL0000210F6C27", "content": "134805696590-TVL0000210F6C27-CHUYEN TIEN-OQCH000EGE66-MOMO134805696590MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 134805696590-TVL0000210F6C27-CHUYEN TIEN-OQCH000EGE66-MOMO134805696590MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26176098407160", "transferAmount": 3532, "transactionDate": "2026-06-25 01:56:00"}	processed	Payment marked as paid	2026-06-24 18:56:54.744645
9	65364513	10	TVL000022FE9595	3000	in	{"id": 65364513, "code": "TVL000022FE9595", "content": "135166597124-TVL000022FE9595-CHUYEN TIEN-OQCH000ERr3O-MOMO135166597124MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135166597124-TVL000022FE9595-CHUYEN TIEN-OQCH000ERr3O-MOMO135166597124MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26178208683147", "transferAmount": 3000, "transactionDate": "2026-06-27 19:51:00"}	processed	Payment marked as paid	2026-06-27 12:51:13.909989
10	65366122	11	TVL000023C630B5	3000	in	{"id": 65366122, "code": "TVL000023C630B5", "content": "135167887857-TVL000023C630B5-CHUYEN TIEN-OQCH000ERuGy-MOMO135167887857MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135167887857-TVL000023C630B5-CHUYEN TIEN-OQCH000ERuGy-MOMO135167887857MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26178950257184", "transferAmount": 3000, "transactionDate": "2026-06-27 20:01:00"}	processed	Payment marked as paid	2026-06-27 13:01:50.084087
11	65368917	12	TVL00002460ECA7	3532	in	{"id": 65368917, "code": "TVL00002460ECA7", "content": "135170335687-TVL00002460ECA7-CHUYEN TIEN-OQCH000ERzbk-MOMO135170335687MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135170335687-TVL00002460ECA7-CHUYEN TIEN-OQCH000ERzbk-MOMO135170335687MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26178737117222", "transferAmount": 3532, "transactionDate": "2026-06-27 20:19:00"}	processed	Payment marked as paid	2026-06-27 13:19:10.433041
12	65626271	13	TVL00002529220F	2500	in	{"id": 65626271, "code": "TVL00002529220F", "content": "135384837172-TVL00002529220F-CHUYEN TIEN-OQCH000EYldB-MOMO135384837172MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135384837172-TVL00002529220F-CHUYEN TIEN-OQCH000EYldB-MOMO135384837172MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180400499706", "transferAmount": 2500, "transactionDate": "2026-06-29 14:34:00"}	processed	Payment marked as paid	2026-06-29 14:34:37.762009
13	65639908	14	TVL0000302D7B72	250000	in	{"id": 65639908, "code": "TVL0000302D7B72", "content": "135394590777-TVL0000302D7B72-CHUYEN TIEN-OQCH000EZ4IZ-MOMO135394590777MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135394590777-TVL0000302D7B72-CHUYEN TIEN-OQCH000EZ4IZ-MOMO135394590777MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180894729489", "transferAmount": 250000, "transactionDate": "2026-06-29 16:09:00"}	ignored	Payment status is expired	2026-06-29 16:09:28.342889
14	65648744	15	TVL000031FE8983	3000	in	{"id": 65648744, "code": "TVL000031FE8983", "content": "135400463963-TVL000031FE8983-CHUYEN TIEN-OQCH000EZGmC-MOMO135400463963MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135400463963-TVL000031FE8983-CHUYEN TIEN-OQCH000EZGmC-MOMO135400463963MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180073593678", "transferAmount": 3000, "transactionDate": "2026-06-29 17:01:00"}	processed	Payment marked as paid	2026-06-29 17:01:35.896574
15	65662559	16	TVL000032F241B1	3000	in	{"id": 65662559, "code": "TVL000032F241B1", "content": "135410719789-TVL000032F241B1-CHUYEN TIEN-OQCH000EZXiM-MOMO135410719789MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135410719789-TVL000032F241B1-CHUYEN TIEN-OQCH000EZXiM-MOMO135410719789MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180328297341", "transferAmount": 3000, "transactionDate": "2026-06-29 18:11:00"}	processed	Payment marked as paid	2026-06-29 18:11:10.924087
16	65667809	\N	TVL0000331DFC34	3000	in	{"id": 65667809, "code": "TVL0000331DFC34", "content": "135415248306-TVL0000331DFC34-CHUYEN TIEN-OQCH000EZh38-MOMO135415248306MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135415248306-TVL0000331DFC34-CHUYEN TIEN-OQCH000EZh38-MOMO135415248306MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180574034147", "transferAmount": 3000, "transactionDate": "2026-06-29 18:41:00"}	processed	Payment marked as paid	2026-06-29 18:41:51.769686
17	65670623	18	TVL0000347D0E61	3000	in	{"id": 65670623, "code": "TVL0000347D0E61", "content": "135417759773-TVL0000347D0E61-CHUYEN TIEN-OQCH000EZm2t-MOMO135417759773MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135417759773-TVL0000347D0E61-CHUYEN TIEN-OQCH000EZm2t-MOMO135417759773MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180570650167", "transferAmount": 3000, "transactionDate": "2026-06-29 18:58:00"}	processed	Payment marked as paid	2026-06-29 18:58:14.586359
18	65678882	19	TVL0000357CFDBC	10000	in	{"id": 65678882, "code": "TVL0000357CFDBC", "content": "135424628153-TVL0000357CFDBC-CHUYEN TIEN-OQCH000Ea0Q5-MOMO135424628153MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135424628153-TVL0000357CFDBC-CHUYEN TIEN-OQCH000Ea0Q5-MOMO135424628153MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180303940647", "transferAmount": 10000, "transactionDate": "2026-06-29 19:47:00"}	processed	Payment marked as paid	2026-06-29 19:47:38.576706
19	65692984	25	TVL000041B61503	3000	in	{"id": 65692984, "code": "TVL000041B61503", "content": "135435633154-TVL000041B61503-CHUYEN TIEN-OQCH000EaNHG-MOMO135435633154MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135435633154-TVL000041B61503-CHUYEN TIEN-OQCH000EaNHG-MOMO135435633154MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180942802700", "transferAmount": 3000, "transactionDate": "2026-06-29 21:14:00"}	processed	Payment marked as paid	2026-06-29 21:14:45.601194
20	65707025	27	TVL00004357445B	6000	in	{"id": 65707025, "code": "TVL00004357445B", "content": "135445921323-TVL00004357445B-CHUYEN TIEN-OQCH000EakVL-MOMO135445921323MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135445921323-TVL00004357445B-CHUYEN TIEN-OQCH000EakVL-MOMO135445921323MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181892263970", "transferAmount": 6000, "transactionDate": "2026-06-29 23:10:00"}	processed	Payment marked as paid	2026-06-29 23:10:08.328083
21	65713026	29	TVL000045E40657	2475	in	{"id": 65713026, "code": "TVL000045E40657", "content": "135449819136-TVL000045E40657-CHUYEN TIEN-OQCH000EarN8-MOMO135449819136MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135449819136-TVL000045E40657-CHUYEN TIEN-OQCH000EarN8-MOMO135449819136MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181866104884", "transferAmount": 2475, "transactionDate": "2026-06-30 00:16:00"}	processed	Payment marked as paid	2026-06-30 00:16:07.849359
22	65804297	33	TVL00005088303B	4950	in	{"id": 65804297, "code": "TVL00005088303B", "content": "TVL00005088303B I21A8U5Q/775811", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL00005088303B I21A8U5Q/775811", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181060321015", "transferAmount": 4950, "transactionDate": "2026-06-30 16:15:00"}	processed	Payment marked as paid	2026-06-30 16:15:50.336273
23	65805714	35	TVL0000533DE750	2914	in	{"id": 65805714, "code": "TVL0000533DE750", "content": "TVL0000533DE750 I21AF22H/848998", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL0000533DE750 I21AF22H/848998", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181254388808", "transferAmount": 2914, "transactionDate": "2026-06-30 16:24:00"}	processed	Payment marked as paid	2026-06-30 16:24:15.188828
24	66040243	36	TVL0000569D3387	3532	in	{"id": 66040243, "code": "TVL0000569D3387", "content": "TVL0000569D3387 I2113JXY/201275", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL0000569D3387 I2113JXY/201275", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26183848005605", "transferAmount": 3532, "transactionDate": "2026-07-01 23:01:00"}	processed	Payment marked as paid	2026-07-01 23:01:27.063091
25	69024120	38	TVL00006330B5CF	3975	in	{"id": 69024120, "code": "TVL00006330B5CF", "content": "138427350059-TVL00006330B5CF-CHUYEN TIEN-OQCH000G2Sqd-MOMO138427350059MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138427350059-TVL00006330B5CF-CHUYEN TIEN-OQCH000G2Sqd-MOMO138427350059MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201384209681", "transferAmount": 3975, "transactionDate": "2026-07-19 22:28:00"}	processed	Payment marked as paid	2026-07-19 22:28:46.491227
26	69097948	39	TVL000065542064	3000	in	{"id": 69097948, "code": "TVL000065542064", "content": "TVL000065542064", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL000065542064", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201176414690", "transferAmount": 3000, "transactionDate": "2026-07-20 13:47:00"}	processed	Payment marked as paid	2026-07-20 13:47:08.160023
27	69099778	40	TVL000066D4B2A0	3000	in	{"id": 69099778, "code": "TVL000066D4B2A0", "content": "TVL000066D4B2A0", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL000066D4B2A0", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201843237011", "transferAmount": 3000, "transactionDate": "2026-07-20 14:01:00"}	processed	Payment marked as paid	2026-07-20 14:01:34.272577
28	69100292	41	TVL00006715BC1D	2000	in	{"id": 69100292, "code": "TVL00006715BC1D", "content": "IBFT TVL00006715BC1D H2C1LSQN/901129", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify IBFT TVL00006715BC1D H2C1LSQN/901129", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201800228016", "transferAmount": 2000, "transactionDate": "2026-07-20 14:05:00"}	processed	Payment marked as paid	2026-07-20 14:05:38.67893
29	69120531	42	TVL0000688DD813	3000	in	{"id": 69120531, "code": "TVL0000688DD813", "content": "138523640262-TVL0000688DD813-CHUYEN TIEN-OQCH000G5BZb-MOMO138523640262MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138523640262-TVL0000688DD813-CHUYEN TIEN-OQCH000G5BZb-MOMO138523640262MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201099229076", "transferAmount": 3000, "transactionDate": "2026-07-20 16:23:00"}	processed	Payment marked as paid	2026-07-20 16:23:10.337519
30	69198764	43	TVL00007079682D	3000	in	{"id": 69198764, "code": "TVL00007079682D", "content": "138585775815-TVL00007079682D-CHUYEN TIEN-OQCH000G7Ld0-MOMO138585775815MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138585775815-TVL00007079682D-CHUYEN TIEN-OQCH000G7Ld0-MOMO138585775815MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26202911719227", "transferAmount": 3000, "transactionDate": "2026-07-21 01:32:00"}	processed	Payment marked as paid	2026-07-21 01:33:01.161866
31	69198929	45	TVL000072C4035C	3000	in	{"id": 69198929, "code": "TVL000072C4035C", "content": "138585960663-TVL000072C4035C-CHUYEN TIEN-OQCH000G7M0D-MOMO138585960663MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138585960663-TVL000072C4035C-CHUYEN TIEN-OQCH000G7M0D-MOMO138585960663MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26202087091790", "transferAmount": 3000, "transactionDate": "2026-07-21 01:39:00"}	processed	Payment marked as paid	2026-07-21 01:39:03.75847
32	69283270	47	TVL00007453AA56	3000	in	{"id": 69283270, "code": "TVL00007453AA56", "content": "138663026258-TVL00007453AA56-CHUYEN TIEN-OQCH000G9VNp-MOMO138663026258MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138663026258-TVL00007453AA56-CHUYEN TIEN-OQCH000G9VNp-MOMO138663026258MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26202631760083", "transferAmount": 3000, "transactionDate": "2026-07-21 16:11:00"}	processed	Payment marked as paid	2026-07-21 16:11:58.755153
\.


--
-- Data for Name: pre_normalize_20260722_000005__statistics; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__statistics (stat_id, type, data, created_at) FROM stdin;
\.


--
-- Data for Name: pre_normalize_20260722_000005__tour; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__tour (tour_id, name, description, price, schedule, capacity, tour_category_id, status, created_at, updated_at, thumbnail, deleted_at, start_at, child_price, slug, short_description, duration_days, duration_nights, start_time, end_time, tour_type, languages, difficulty, minimum_participants, minimum_booking, maximum_booking, meeting_point, pickup_available, pickup_description, highlights, inclusions, exclusions, requirements, cancellation_policy, booking_policy, additional_information, faqs, video_url, gallery, currency, infant_price) FROM stdin;
1	Dinh Doc Lap Half-day Tour UPDATE	Explore Dinh Doc Lap with 360 preview and tour guide	750000	1 day 08:00 - 17:00	30	4	active	2026-05-27 14:01:13.658986	2026-07-21 20:06:52.478459	https://s3.cloudfly.vn/travellens/tours/1782282834284-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	\N	\N	162500.00	dinh-doc-lap-half-day-tour-update-1		1	0	08:00:00	17:00:00	group	["vi"]	easy	1	1	\N		f		[]	[]	[]	[]	\N	\N	\N	[]		[]	VND	0.00
3	Người Yêu Cũ		2	1 day 09:00 - 17:00	2	\N	deleted	2026-06-18 15:55:00.294418	2026-06-18 16:06:17.088777	\N	2026-06-18 16:06:17.088777	\N	1.30	nguoi-yeu-cu-3	\N	1	0	\N	\N	group	[]	easy	1	1	\N	\N	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
2	Dinh Doc Lap Half-day Tour	Explore Dinh Doc Lap with 360 preview and tour guide<div><img src="https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg" alt="The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg"><p><br></p></div>	250000	1 day 08:00 - 17:00	30	4	active	2026-06-02 16:00:39.523557	2026-06-23 18:29:41.041535	https://s3.cloudfly.vn/travellens/tours/1781797468791-Screenshot-2025-03-11-212405.png	\N	\N	162500.00	dinh-doc-lap-half-day-tour-2	\N	1	0	\N	\N	group	[]	easy	1	1	\N	\N	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
4	Hè mát mẻ		3532	1 day 08:00 - 17:00	50	4	active	2026-06-18 16:13:34.620645	2026-06-23 20:33:50.622119	\N	\N	\N	2295.80	he-mat-me-4	\N	1	0	\N	\N	group	[]	easy	1	1	\N	\N	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
5	Trờ Về Tuổi Thơ		463643	1 day 08:00 - 17:00	464	4	deleted	2026-06-18 16:21:35.454433	2026-06-24 07:01:54.681373	https://s3.cloudfly.vn/travellens/tours/1782284487277-Screenshot-2026-03-24-200329.png	2026-06-24 07:01:54.681373	\N	301367.95	tro-ve-tuoi-tho-5	\N	1	0	\N	\N	group	[]	easy	1	1	\N	\N	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
6	Suối Tiên	<img src="https://s3.cloudfly.vn/travellens/media/1782214382526-PaymentStatusUpdate-drawio.png" alt="PaymentStatusUpdate.drawio.png"><p><br></p>đẹp&nbsp;	3000	1 day 09:00:00 - 17:00:00	50	4	active	2026-06-24 07:17:16.364663	2026-07-20 14:11:40.574524	https://s3.cloudfly.vn/travellens/tours/1782285521014-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	\N	\N	1950.00	suoi-tien-6		1	0	09:00:00	17:00:00	group	["vi"]	easy	1	1	\N		f		["Highlights 1", "Highlights 2", "Highlight Content 1", "Highlight Content 2"]	["Inclusions 1", "Inclusions 2", "Inclusions Content 2", "Inclusions Content 3"]	["Exclusions 1", "Exclusions 2"]	["Requirements 1", "Requirements 2"]	Cancellation Policy\r\nCancellation Policy\r\nCancellation Policy\r\n	Booking Policy\r\nBooking Policy\r\nBooking Policy\r\n	Additional Information\r\nAdditional Information\r\n	[{"answer": "a s", "faq_id": 1, "question": "a", "order_index": 1}, {"answer": "b s", "faq_id": 2, "question": "b", "order_index": 2}]		[{"alt": "truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg", "url": "https://s3.cloudfly.vn/travellens/media/1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg", "type": "image", "media_id": 1, "order_index": 1}, {"alt": "PaymentStatusUpdate.drawio.png", "url": "https://s3.cloudfly.vn/travellens/media/1782214382526-PaymentStatusUpdate-drawio.png", "type": "image", "media_id": 2, "order_index": 2}, {"alt": "Delete review.drawio.png", "url": "https://s3.cloudfly.vn/travellens/media/1782214256372-Delete-review-drawio.png", "type": "image", "media_id": 3, "order_index": 3}, {"alt": "The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg", "url": "https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg", "type": "image", "media_id": 4, "order_index": 4}, {"alt": "Createbookingt.drawio.png", "url": "https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png", "type": "image", "media_id": 5, "order_index": 5}]	VND	0.00
\.


--
-- Data for Name: pre_normalize_20260722_000005__tour_category; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__tour_category (tour_category_id, name, description, created_at, updated_at) FROM stdin;
4	Family		2026-06-19 16:12:27.028995	2026-06-19 16:12:27.028995
6	Couple		2026-06-23 17:51:48.16318	2026-06-23 17:51:48.16318
\.


--
-- Data for Name: pre_normalize_20260722_000005__tour_content_item; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__tour_content_item (content_item_id, type, content, status, created_at, updated_at, deleted_at, normalized_content) FROM stdin;
2	requirement	Requirements Content 1	active	2026-07-19 21:00:09.025121	2026-07-19 21:26:03.898368	\N	requirements content 1
7	exclusion	Exclusion Content 1	active	2026-07-20 00:19:03.56738	2026-07-20 00:19:03.56738	\N	exclusion content 1
8	exclusion	Exclusion Content 2	active	2026-07-20 00:19:03.56738	2026-07-20 00:19:03.56738	\N	exclusion content 2
9	exclusion	Exclusion Content 3	active	2026-07-20 00:19:03.56738	2026-07-20 00:19:03.56738	\N	exclusion content 3
3	inclusion	Inclusions Content 1	active	2026-07-19 21:01:18.546453	2026-07-20 00:22:28.491376	\N	inclusions content 1
10	inclusion	Inclusions Content 2	active	2026-07-20 00:22:56.823063	2026-07-20 00:22:56.823063	\N	inclusions content 2
11	highlight	Inclusions Content 3	inactive	2026-07-20 00:23:04.129385	2026-07-20 00:23:15.605105	2026-07-20 00:23:15.605105	inclusions content 3
12	inclusion	Inclusions Content 3	active	2026-07-20 00:23:28.096295	2026-07-20 00:23:28.096295	\N	inclusions content 3
4	highlight	Highlight Content 1	inactive	2026-07-19 21:10:53.993642	2026-07-20 00:24:13.242754	2026-07-20 00:24:13.242754	highlight content 1
1	highlight	Highlight Content 1	active	2026-07-19 20:59:41.827127	2026-07-20 00:24:31.580265	\N	highlight content 1
13	highlight	Highlight Content 2	active	2026-07-20 00:24:45.058479	2026-07-20 00:24:45.058479	\N	highlight content 2
14	highlight	Highlight Content 3	active	2026-07-20 00:24:51.963271	2026-07-20 00:24:51.963271	\N	highlight content 3
16	highlight	cd	inactive	2026-07-20 15:38:00.462892	2026-07-20 15:38:42.015894	2026-07-20 15:38:42.015894	cd
15	highlight	abc	inactive	2026-07-20 15:38:00.462892	2026-07-20 15:39:11.961943	2026-07-20 15:39:11.961943	abc
\.


--
-- Data for Name: pre_normalize_20260722_000005__tour_content_item_link; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__tour_content_item_link (tour_id, content_item_id, source_content_item_id, content_type, snapshot_content, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: pre_normalize_20260722_000005__tour_destination; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__tour_destination (tour_destination_id, tour_id, destination_id, order_index, estimated_time, note, created_at, updated_at, day_number, start_time, end_time, estimated_minutes, activity) FROM stdin;
10	3	2	1	\N	\N	2026-06-18 16:03:45.219335	2026-06-18 16:03:45.219335	1	\N	\N	\N	\N
30	2	3	1	\N	\N	2026-06-23 18:29:41.041535	2026-06-23 18:29:41.041535	1	\N	\N	\N	\N
32	4	2	1	\N	\N	2026-06-23 20:33:50.622119	2026-06-23 20:33:50.622119	1	\N	\N	\N	\N
36	5	2	1	\N	\N	2026-06-24 07:01:45.624569	2026-06-24 07:01:45.624569	1	\N	\N	\N	\N
53	6	3	1	\N	\N	2026-07-20 14:11:40.574524	2026-07-20 14:11:40.574524	1	\N	\N	\N	\N
54	6	7	2	\N	\N	2026-07-20 14:11:40.574524	2026-07-20 14:11:40.574524	1	\N	\N	\N	\N
55	1	3	1	\N	\N	2026-07-21 20:06:52.478459	2026-07-21 20:06:52.478459	1	\N	\N	\N	\N
56	1	2	2	\N	\N	2026-07-21 20:06:52.478459	2026-07-21 20:06:52.478459	1	\N	\N	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_destination; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_destination (destination_id, name, description, thumbnail, created_at, updated_at, deleted_at, destination_category_id, latitude, longitude) FROM stdin;
3	Bến Nhà Rồng	Historic landmark in Ho Chi Minh City<img src="https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg" alt="The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg" loading="lazy" /><p><img src="https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png" alt="Createbookingt.drawio.png" loading="lazy" /></p><p><br /></p>	https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg	2026-05-27 13:59:27.396451	2026-07-21 23:45:34.100537	\N	1	10.768211	106.70667
4	vo chi cong	dgfsg	\N	2026-06-10 14:17:05.045635	2026-06-10 14:17:16.017492	2026-06-10 14:17:16.017492	1	\N	\N
5	fsa	à	\N	2026-06-10 14:22:45.463808	2026-06-10 14:22:53.54537	2026-06-10 14:22:53.54537	\N	\N	\N
6	Làng Du Lịch Sinh Thái Ông Đề	Làng du lịch sinh thái Ông Đề tại Phong Điền, Cần Thơ. Combo tour trọn gói, trò chơi dân gian miền Tây, homestay view sông, team building doanh nghiệp	https://s3.cloudfly.vn/travellens/travel-destinations/1782231791429-langdulichsinhthaiongde-2-5737.jpg	2026-06-23 16:23:54.462494	2026-06-23 16:23:54.462494	\N	4	9.990583	105.709202
2	Dinh Độc Lập	Updated historic landmark description	https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png	2026-05-21 14:07:30.300756	2026-06-23 19:37:56.502682	\N	1	10.777035	106.695488
7	Đại Học FPT Cần Thơ	Toạ lạc tại số 600 Nguyễn Văn Cừ nối dài, TP Cần Thơ, Trường Đại học FPT trở thành một không gian học tập chuẩn quốc tế dành cho sinh viên ngay tại ĐBSCL<img src="https://s3.cloudfly.vn/travellens/media/1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg" alt="truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg" loading="lazy" /><p><br /></p>	https://s3.cloudfly.vn/travellens/travel-destinations/1782244022126-picture3-17171710448722083760711.png	2026-06-23 19:47:34.257503	2026-06-23 19:47:34.257503	\N	4	10.01349	105.731715
8	Dinh Độc Lập 2	<p></p><p>Dinh Độc Lập không chỉ mang vẻ đẹp kiến trúc mà còn là biểu tượng của nền hòa bình, thống nhất, là điểm tham quan hút khách bậc nhất ở Thành phố Hồ Chí Minh mỗi dịp 30/4.<br></p><p><!--StartFragment--><img src="https://cdn.nhandan.vn/images/1ea1ae7a315d88fc6fbf436960826115d9e6b3c6f48f6ffcf9e7d3e9837338b4b245fa16257e5636229b63455fd9ecb196aff7300f5d6547d069525157cc8310/img-6993-237-2419.jpg.avif" alt="Trước ngày 30/4/1975 lịch sử, Dinh Độc Lập là một trong những cơ quan đầu não chính quyền Sài Gòn, nơi chứng kiến sự can thiệp quân sự của nước ngoài gây chiến tranh tàn khốc ở Việt Nam. Trên đây là hình ảnh Dinh Độc Lập nhìn từ trên cao (Ảnh chụp tháng 4 năm 2025)."></p><p>Trước ngày 30/4/1975 lịch sử, Dinh Độc Lập là một trong những cơ quan đầu não chính quyền Sài Gòn, nơi chứng kiến sự can thiệp quân sự của nước ngoài gây chiến tranh tàn khốc ở Việt Nam. Trên đây là hình ảnh Dinh Độc Lập nhìn từ trên cao (Ảnh chụp tháng 4 năm 2025).</p><p><img src="https://cdn.nhandan.vn/images/1ea1ae7a315d88fc6fbf436960826115d9e6b3c6f48f6ffcf9e7d3e9837338b43fef7dca55d8f5be11a44e0ca194194b380e40c66b6e6b499618d78684f38c7e/a-7420-9504.jpg.avif" alt="Hình ảnh Dinh Độc Lập trước năm 1975.">Hình ảnh Dinh Độc Lập trước năm 1975.<img src="https://cdn.nhandan.vn/images/1ea1ae7a315d88fc6fbf436960826115d9e6b3c6f48f6ffcf9e7d3e9837338b48f92adfdac3325fdcdd9747389fed1bd0b364130c814e14d5bd496725026ec10/a1-9648-2051.jpg.avif" alt="Hình ảnh Dinh Độc Lập hiện nay - 50 năm sau ngày toàn thắng (Ảnh chụp tháng 4 năm 2025)."><!--EndFragment--></p><p>Hình ảnh Dinh Độc Lập hiện nay - 50 năm sau ngày toàn thắng (Ảnh chụp tháng 4 năm 2025).</p><p>\r\n</p><p>\r\n</p><p>\r\n</p><p>\r\n</p><p>\r\n</p><p>\r\n</p><p>\r\n</p><p>\r\n</p><p>\r\n</p>	https://s3.cloudfly.vn/travellens/travel-destinations/1782286635854-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	2026-06-24 07:37:19.436132	2026-07-01 15:17:00.835734	\N	1	10.777035	106.695523
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_post; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_post (post_id, user_id, content, destination_id, location_id, status, visibility, like_count, comment_count, report_count, created_at, updated_at, deleted_at, share_count, previous_status, deleted_by, restored_at, restored_by) FROM stdin;
12	58	quá ngon :v	\N	\N	published	public	0	0	0	2026-07-21 02:59:08.666196	2026-07-21 14:09:22.506286	\N	0	\N	\N	\N	\N
4	1	Create Post demo - customer tao bai viet moi tren Travel Feed	2	1	published	public	0	0	0	2026-07-05 20:54:47.565107	2026-07-05 20:54:47.565107	\N	0	\N	\N	\N	\N
1	1	[travel-feed-sample] Buoi sang o Cổng Dinh Độc Lập rat dep, anh sang vua du de chup may tam hinh ky niem.	2	1	published	public	2	2	1	2026-07-05 20:28:36.526374	2026-07-18 14:53:55.080162	\N	0	\N	\N	2026-07-18 14:53:55.080162	2
13	58	tét	\N	\N	deleted	public	0	0	0	2026-07-21 14:09:56.502273	2026-07-21 14:10:12.663009	2026-07-21 14:10:12.663009	0	published	58	\N	\N
2	3	[travel-feed-sample] Minh vua ghe Dinh Độc Lập, khong gian thoang va co nhieu goc chup anh.	2	1	published	public	0	1	1	2026-07-05 20:28:36.526374	2026-07-18 15:03:20.559977	\N	0	\N	\N	\N	\N
11	58	FHFDJFDH	\N	\N	published	public	1	3	0	2026-07-20 16:28:18.228484	2026-07-21 16:15:54.70979	\N	1	\N	\N	\N	\N
10	1	7/13/2026	\N	\N	published	public	2	2	1	2026-07-13 21:12:50.664125	2026-07-18 22:51:50.825912	\N	0	\N	\N	\N	\N
3	1	[travel-feed-sample] Goi y nho: nen di som de tranh dong va co thoi gian xem het cac khu vuc chinh.	2	1	published	public	2	0	0	2026-07-05 20:28:36.526374	2026-07-13 17:27:23.813847	\N	0	\N	\N	\N	\N
7	57	\N	3	5	published	public	0	0	0	2026-07-05 21:18:11.1605	2026-07-19 20:28:18.479316	\N	1	\N	\N	\N	\N
5	57	quan cảnh rất đẹp	6	\N	deleted	public	1	0	0	2026-07-05 21:08:08.189243	2026-07-19 20:48:21.910625	2026-07-19 20:48:21.910625	0	published	57	\N	\N
6	1	Free post demo - khong chon destination hay location	\N	\N	published	public	1	1	0	2026-07-05 21:12:16.670837	2026-07-20 21:13:10.456033	\N	2	\N	\N	\N	\N
8	57	sdvvdvssd dc	\N	\N	published	public	2	2	1	2026-07-05 21:19:01.177445	2026-07-21 02:56:53.428358	\N	0	\N	\N	2026-07-18 15:02:42.08641	2
9	57	123	\N	\N	published	public	3	6	1	2026-07-05 21:26:13.077242	2026-07-21 02:57:54.888911	\N	7	\N	\N	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_post_comment; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_post_comment (comment_id, post_id, user_id, parent_comment_id, content, status, created_at, updated_at, deleted_at) FROM stdin;
1	1	3	\N	Dia diem nay nhin rat hop de di cuoi tuan.	published	2026-07-05 20:28:36.526374	2026-07-05 20:28:36.526374	\N
2	2	1	\N	Cam on ban da chia se, minh se luu lai cho lich trinh sau.	published	2026-07-05 20:28:36.526374	2026-07-05 20:28:36.526374	\N
4	8	1	3	dfgfhj	deleted	2026-07-13 17:24:03.390241	2026-07-13 17:24:20.008963	2026-07-13 17:24:20.008963
5	1	1	1	dr	published	2026-07-13 17:27:42.947672	2026-07-13 17:27:42.947672	\N
6	8	1	3	ok	published	2026-07-13 20:02:02.411735	2026-07-13 20:02:02.411735	\N
3	8	1	\N	123	deleted	2026-07-13 17:21:37.818668	2026-07-13 20:02:08.738251	2026-07-13 20:02:08.738251
7	8	1	\N	12345	deleted	2026-07-13 20:02:15.586326	2026-07-13 20:02:31.843339	2026-07-13 20:02:31.843339
8	9	57	\N	ádf	deleted	2026-07-13 20:06:02.072185	2026-07-13 20:12:08.124105	2026-07-13 20:12:08.124105
9	9	57	8	osdnv kscv	deleted	2026-07-13 20:07:04.113906	2026-07-13 20:12:12.870759	2026-07-13 20:12:12.870759
10	9	1	8	adsfgt	deleted	2026-07-13 20:07:43.844294	2026-07-13 20:12:35.860908	2026-07-13 20:12:35.860908
11	9	1	8	sdfg	deleted	2026-07-13 20:11:40.562187	2026-07-13 20:12:37.258012	2026-07-13 20:12:37.258012
12	9	1	\N	12345	published	2026-07-13 20:16:52.923615	2026-07-13 20:16:52.923615	\N
13	9	1	12	23456	published	2026-07-13 20:16:59.518255	2026-07-13 20:16:59.518255	\N
14	9	57	\N	567sfghfn	published	2026-07-13 20:19:55.250644	2026-07-13 20:19:55.250644	\N
15	9	1	14	ưymbrgt	published	2026-07-13 20:20:14.182182	2026-07-13 20:20:14.182182	\N
16	6	57	\N	12345ynbvder	published	2026-07-13 21:11:49.284945	2026-07-13 21:11:49.284945	\N
17	10	1	\N	1232334	published	2026-07-13 21:13:34.227511	2026-07-13 21:13:39.760844	\N
18	9	57	\N	23456	published	2026-07-13 21:44:34.862413	2026-07-13 21:44:41.587034	\N
19	9	1	18	sdvff	published	2026-07-13 21:45:10.856749	2026-07-13 21:45:10.856749	\N
20	10	1	\N	scmskcnkxc	published	2026-07-18 22:51:50.825912	2026-07-18 22:51:50.825912	\N
21	11	58	\N	DSSD	published	2026-07-20 16:28:27.595982	2026-07-20 16:28:27.595982	\N
23	8	58	6	ok	published	2026-07-20 20:28:13.681884	2026-07-20 20:28:13.681884	\N
22	11	58	21	ưetw	deleted	2026-07-20 16:28:33.212631	2026-07-20 20:46:06.508719	2026-07-20 20:46:06.508719
25	11	58	21	đfhfh	deleted	2026-07-20 20:46:28.890694	2026-07-20 20:46:36.747832	2026-07-20 20:46:36.747832
26	11	58	21	dfhfhdf	deleted	2026-07-20 20:49:32.119525	2026-07-20 20:49:37.653504	2026-07-20 20:49:37.653504
28	11	58	\N	XCNXNC	published	2026-07-20 20:52:40.757333	2026-07-20 20:52:40.757333	\N
27	11	58	\N	CBBX	deleted	2026-07-20 20:52:36.825423	2026-07-20 20:52:45.380147	2026-07-20 20:52:45.380147
29	11	58	28	test	published	2026-07-20 22:32:39.104136	2026-07-20 22:32:39.104136	\N
24	8	58	23	vip 1	deleted	2026-07-20 20:28:21.959338	2026-07-21 02:56:53.428358	2026-07-21 02:56:53.428358
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_post_like; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_post_like (post_id, user_id, created_at) FROM stdin;
1	3	2026-07-05 20:28:36.526374
3	3	2026-07-05 20:28:36.526374
8	1	2026-07-13 16:16:44.616737
9	1	2026-07-13 16:16:59.933329
5	1	2026-07-13 16:18:14.5123
6	1	2026-07-13 17:27:03.822641
3	1	2026-07-13 17:27:23.813847
1	1	2026-07-13 17:28:13.471405
9	57	2026-07-13 20:06:07.12426
10	57	2026-07-13 21:42:11.10984
10	1	2026-07-18 22:51:45.16707
8	58	2026-07-20 20:21:32.340628
9	58	2026-07-20 20:29:33.397676
11	58	2026-07-21 16:15:54.70979
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_post_photo; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_post_photo (photo_id, post_id, image_url, display_order, created_at, deleted_at) FROM stdin;
1	1	https://s3.cloudfly.vn/travellens/travel-feed/1783258672611-1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	0	2026-07-05 20:28:36.526374	\N
2	1	https://s3.cloudfly.vn/travellens/travel-feed/1783258673881-1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	1	2026-07-05 20:28:36.526374	\N
3	2	https://s3.cloudfly.vn/travellens/travel-feed/1783258674266-1779895714183-screenshot_1773716998.png	0	2026-07-05 20:28:36.526374	\N
4	3	https://s3.cloudfly.vn/travellens/travel-feed/1783258674664-1779810494214-Screenshot-2026-03-16-073932.png	0	2026-07-05 20:28:36.526374	\N
5	4	https://s3.cloudfly.vn/travellens/travel-feed/1783258672611-1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	0	2026-07-05 20:54:47.565107	\N
6	5	https://s3.cloudfly.vn/travellens/travel-feed/1783260491957-Screenshot-2026-07-05-210149.png	0	2026-07-05 21:08:08.189243	\N
8	9	https://s3.cloudfly.vn/travellens/travel-feed/1783261571190-Screenshot-2026-06-30-234857.png	0	2026-07-05 21:26:13.077242	\N
7	7	https://s3.cloudfly.vn/travellens/travel-feed/1783261094732-Screenshot-2026-06-30-161553.png	0	2026-07-05 21:18:11.1605	2026-07-19 19:58:01.72595
9	7	https://s3.cloudfly.vn/travellens/travel-feed/1784465739018-a1.png	0	2026-07-19 19:55:39.631419	2026-07-19 20:03:27.815078
10	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466201125-a3.png	0	2026-07-19 20:03:21.236695	\N
11	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222835-a4.png	1	2026-07-19 20:03:43.338047	\N
12	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222838-Screenshot-2026-03-15-064726.png	2	2026-07-19 20:03:43.338047	\N
13	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222840-Screenshot-2026-03-15-070432.png	3	2026-07-19 20:03:43.338047	\N
14	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222842-Screenshot-2026-03-15-071412.png	4	2026-07-19 20:03:43.338047	\N
15	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222843-Screenshot-2026-03-15-071451.png	5	2026-07-19 20:03:43.338047	\N
16	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222844-Screenshot-2026-03-15-211701.png	6	2026-07-19 20:03:43.338047	\N
17	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468956990-a1.png	0	2026-07-19 20:49:17.360134	\N
18	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468956999-a2.png	1	2026-07-19 20:49:17.360134	\N
19	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468957000-a3.png	2	2026-07-19 20:49:17.360134	\N
20	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468957001-a4.png	3	2026-07-19 20:49:17.360134	\N
21	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468957003-Screenshot-2026-03-15-064726.png	4	2026-07-19 20:49:17.360134	\N
22	11	https://s3.cloudfly.vn/travellens/travel-feed/1784539695487-1.png	0	2026-07-20 16:28:18.228484	\N
23	12	https://s3.cloudfly.vn/travellens/travel-feed/1784577535593-scaled_1784577522504.jpg	0	2026-07-21 02:59:08.666196	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_post_report; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_post_report (report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at) FROM stdin;
4	8	1	spam	\N	dismissed	2	2026-07-18 14:35:58.992318	2026-07-13 17:02:02.117375
7	1	58	harassment	test có comment	dismissed	2	2026-07-18 14:42:22.280439	2026-07-18 14:20:16.757393
1	9	1	spam	\N	resolved	2	2026-07-18 14:55:46.680232	2026-07-13 16:53:48.210505
8	10	58	inappropriate_content	test	resolved	2	2026-07-18 14:56:30.185803	2026-07-18 14:56:14.918917
9	2	58	spam	\N	pending	\N	\N	2026-07-18 15:03:20.559977
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_post_share; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_post_share (share_id, post_id, user_id, platform, counted, created_at) FROM stdin;
1	9	1	facebook	t	2026-07-13 20:36:15.76379
2	9	57	facebook	t	2026-07-13 20:36:28.617852
3	9	57	facebook	f	2026-07-13 20:36:48.35364
4	9	57	facebook	t	2026-07-13 20:42:24.500296
5	9	57	zalo	t	2026-07-13 20:43:00.380633
6	9	57	facebook	f	2026-07-13 20:43:07.677729
7	7	57	facebook	t	2026-07-13 20:43:28.078727
8	9	57	facebook	f	2026-07-13 20:45:49.999825
9	9	57	facebook	t	2026-07-13 20:48:24.358724
10	9	57	facebook	t	2026-07-13 21:44:07.820935
11	6	58	other	t	2026-07-20 20:23:15.850928
12	11	58	other	t	2026-07-20 20:23:23.851758
13	6	58	other	t	2026-07-20 21:13:10.456033
14	9	58	other	t	2026-07-21 02:57:54.888911
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_story; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_story (story_id, user_id, media_url, media_type, caption, status, expires_at, created_at, updated_at, deleted_at) FROM stdin;
1	58	https://s3.cloudfly.vn/travellens/travel-stories/1784477361877-1e15f66ec1eaaab1df942f9891bf8fc7.jpg	image	haha	active	2026-07-20 23:09:15.92167	2026-07-19 23:09:15.92167	2026-07-19 23:09:15.92167	\N
2	58	https://s3.cloudfly.vn/travellens/travel-stories/1784477420817-646814098_1388508773311572_2631454367341666066_n.jpg	image	TEST	active	2026-07-20 23:10:15.942343	2026-07-19 23:10:15.942343	2026-07-19 23:10:15.942343	\N
3	58	https://s3.cloudfly.vn/travellens/travel-stories/1784577607796-IMG_20260713_165831.jpg	image	mê	active	2026-07-22 03:00:12.110808	2026-07-21 03:00:12.110808	2026-07-21 03:00:12.110808	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__travel_story_view; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__travel_story_view (story_id, viewer_id, viewed_at) FROM stdin;
2	1	2026-07-19 23:23:28.00055
1	1	2026-07-19 23:23:30.174409
\.


--
-- Data for Name: pre_normalize_20260722_000005__user_block; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__user_block (blocker_id, blocked_id, created_at) FROM stdin;
\.


--
-- Data for Name: pre_normalize_20260722_000005__users; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__users (user_id, name, email, password, role, status, profile_info, google_id, avatar_url, created_at, updated_at, phone, date_of_birth, gender, address, otp, otp_expires_at) FROM stdin;
4	Nguyen C	nguyenchiduongp1@gmail.com	$2a$10$Wf1uJqSC8itb1h9/CuKDuOOF/LlvfZien.zij/8nLqLM/rukYsAlO	staff	active	Loves beaches and mountain trips	114714939774840934464	https://lh3.googleusercontent.com/a/ACg8ocITjnrff5nW9MvHWIbkqcmzqdCN2TJdmK5gTsIn5CRosXjXpOzN=s96-c	2026-05-27 06:30:09.073204	2026-06-30 21:38:33.196729	0901234567	1998-05-17	male	Ho Chi Minh City	\N	\N
55	Le Dang Khoa (K18 CT)	khoaldce181030@fpt.edu.vn	\N	customer	active	\N	114814988748013948873	https://lh3.googleusercontent.com/a/ACg8ocJY-qojIFgcNOoWjo-M9YuwUEv18CkSiY_Wra4s9YhKHKd96IY=s96-c	2026-06-24 06:08:53.214353	2026-06-24 06:08:53.214353	\N	\N	\N	\N	\N	\N
9	Nguyen Truong	user.updated@eduxample.com	$2a$10$m3njYQNghlZyKZumHyQTgOMAGAhbMunkEMY47B96Kdtda/Jy6ERIm	staff	active	\N	\N	\N	2026-05-30 13:30:57.679208	2026-05-30 14:12:22.689994	0907654321	\N	\N	\N	\N	\N
3	Nguyen Van A	a@example.com	$2a$10$pY8ubqpoAk4q2HOFU5Lf2e5ra31OvG3GVkKLg90VvYFPPUl5PttPK	customer	active	Travel lover from Da Nang	\N	https://example.com/avatar.png	2026-05-25 13:21:52.960159	2026-05-25 13:21:52.960159	0763388151	\N	\N	\N	\N	\N
5	Nguyen Van Hoai	hoai@gmmail.com	$2a$10$B0Kx/j2hef7PZ/hbpKJbw.PHTWsl6ByPxmNa6p.FD0zFdYy5EEFzi	customer	active	\N	\N	\N	2026-05-30 13:13:59.432767	2026-05-30 13:13:59.432767	0901234567	\N	\N	Ho Chi Minh City	\N	\N
10	Doan thi yen nhi	nhi@example.com	$2a$10$HQwrdrVWUTiD6aoeEZPdleBCPxsX2.6WapLohKHG9YrgVL5GsA7.q	customer	active	\N	\N	\N	2026-05-30 13:32:54.312095	2026-05-30 13:32:54.312095		\N	\N	\N	\N	\N
49	Đoàn Nhi	nhidtyce180492@fpt.edu.vn	$2a$10$ImsIMvUxxpOsJ9jDPsdWhOe2DacsnZvlZCfVDMdg4p/xcdY3Jaymm	staff	pending	\N	\N	\N	2026-06-23 18:19:16.005327	2026-06-30 22:17:59.538447	\N	\N	\N	\N	\N	\N
11	Dang khoa	khoa@example.com	$2a$10$asM/6H9q8tI99aq2jUJUm.NCThgPYOOyWN6HSkkxWSpExLOAMavD.	customer	active	\N	\N	\N	2026-06-02 15:16:17.996053	2026-06-02 15:17:30.870252	0901234567	\N	\N	\N	\N	\N
58	Hoài Vip Pro Max Ultra	hoaipv.work@gmail.com	$2a$10$mYKao7wKppU30u7s5uydourdP0ra3UgsL9IFUkZ5VxFoTd4EflFfa	customer	active		114255198313077573867	https://s3.cloudfly.vn/travellens/users/1784623588661-scaled_1784623581503.jpg	2026-06-29 23:07:38.525909	2026-07-21 15:46:44.756102		2003-08-25			\N	\N
1	Nguyen Van Hoai	user@example.com	$2a$10$cSg6Iq6hkefzEXXwKZkhTu2m0Egkjq5/roIP0tohw3p9I.DEg964S	customer	active	Loves beaches and mountain trips	123456789	https://s3.cloudfly.vn/travellens/users/1781622860613-cae3fc6c-cfe5-46d2-a427-dd4b07b81c8b.png	2026-05-25 15:26:24.011982	2026-06-23 17:04:04.777395	0901234567	1998-05-05	male	Ho Chi Minh City	\N	\N
57	Nguyễn Chí Dương	duongncce180374@fpt.edu.vn	$2a$10$tUVdO9NCh8PmG63HZJvKc.j7pwzrxwiWubgYqA0MN0gZQGEPrIhrS	customer	active		\N	https://s3.cloudfly.vn/travellens/users/1782284749355-b59266e8-930f-47f5-95de-ee13c5d2e088.png	2026-06-24 07:05:53.452002	2026-07-02 14:31:37.761625	0763388155	2004-06-23	male	can tho	\N	\N
56	Lê Thịnh	lethinh15012004@gmail.com	$2a$10$TbVYlrmu7E2YyZQKDk5mSOEXuCZtPez41Ik4lFsGP2qeIL7PEqqsS	customer	active	\N	\N	\N	2026-06-24 07:00:02.82027	2026-06-24 07:00:02.82027	\N	\N	\N	\N	\N	\N
50	Đoàn Nhi	yennhidoan08042004@gmail.com	$2a$10$9De03WPmg1v55p3te9thuuCTc./XW/M17.XVA4USTE/Jo5sdthnMK	customer	active	\N	\N	\N	2026-06-23 18:20:10.018492	2026-06-23 18:20:10.018492	\N	\N	\N	\N	\N	\N
60	Pham Van Hoai FPT	phamvanhoaifpt@gmail.com	$2a$10$llB2..nEjn0SoLpclCYpqOPKmiQmX8dBG12lBTuPuD/2nMcZymv5a	customer	active	\N	\N	\N	2026-07-18 22:44:29.657127	2026-07-18 22:44:29.657127	\N	\N	\N	\N	\N	\N
52	Staff System	staff@gmail.com	$2a$10$tnFCVcOKyyhWfqlKHWLaweAJHSrhoEao/0clGDjNKlFlbp8H9xJSO	staff	active	\N	\N	\N	2026-06-24 02:33:20.868995	2026-06-24 02:33:20.868995	0917823718	\N	\N	\N	\N	\N
2	Admin System	admin@gmail.com	$2a$10$4sbO40qPjl.XW1mfKXFLruhwEZPGmHI67pvi1X6I1BKTmwby1lp3K	admin	active	Travel lover from Da Nang	\N	https://s3.cloudfly.vn/travellens/users/1781624535743-f5bd27125cc31f2edbe359fb728eb8ab.jpg	2026-05-25 15:26:24.011982	2026-06-24 02:34:01.456063		2000-01-01			\N	\N
61	Đăng Khoa Lê	ledangkhoadz@gmail.com	\N	customer	active	\N	114543733963395879004	https://lh3.googleusercontent.com/a/ACg8ocIlBD5ALpEVvVet5FCTi63N95Ra5kfB-PnM9GpsXQDq59CwZTu_=s96-c	2026-07-20 13:33:09.192231	2026-07-20 13:33:09.192231	\N	\N	\N	\N	\N	\N
62	Nguyen Thi Ngoc Hoa (K18 CT)	hoantncs180622@fpt.edu.vn	\N	customer	active	\N	103730734456845894234	https://lh3.googleusercontent.com/a/ACg8ocIdlB3JJB2y4dR1qDYIlVOky5TvdXh-yPAfXUpNFVLNgzuMFQ=s96-c	2026-07-20 13:37:26.418318	2026-07-20 13:37:26.418318	\N	\N	\N	\N	\N	\N
51	Hoài Đẹp Trai	phamvanhoai600@gmail.com	$2a$10$CwHX7xEvoygH2No5cDQq3uECFuHGZfIFf.BDZGlHlAu51vgseFLsG	admin	active		106909240090457145701	https://lh3.googleusercontent.com/a/ACg8ocLmP-59JoleEp7y-dGXltBiTcqE9zeVvtMRcITlq9PrmjCVHpRE=s96-c	2026-06-23 18:56:17.183567	2026-06-29 16:29:09.854728		2003-08-25			\N	\N
59	Le Thinh (K18 CT)	thinhlce180136@fpt.edu.vn	\N	customer	active	\N	105133515427426848050	https://lh3.googleusercontent.com/a/ACg8ocJs5aFHpjO7F166jZWkc3mmr8SPWq1yYinr0X3PWBgL7dG88BU=s96-c	2026-06-30 15:49:28.55483	2026-06-30 15:49:28.55483	\N	\N	\N	\N	\N	\N
63	test app	phamvanhoaiit@gmail.com	$2a$10$2TP1UwrhQ19bf/yAT0a9u.QNbKbat7pb2Yd4lMYtEOjmQKjk8FRJm	customer	active	\N	\N	\N	2026-07-21 02:21:39.867647	2026-07-21 02:21:39.867647	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__view360; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__view360 (view_id, location_id, description, audio_file, language, title, order_index, created_at, updated_at, deleted_at) FROM stdin;
2	4		https://s3.cloudfly.vn/travellens/view360-audio/1781939913232-River-Flows-In-You-Piano-00_00_00-00_01_13.mp3	Vietnamese	test	0	2026-06-20 07:12:53.823489	2026-07-20 15:00:43.851999	\N
3	1	Dinh Độc Lập được công nhận là Di tích lịch sử văn hóa quốc gia bằng Quyết định số 77A/VHQĐ ngày 25/6/1976 của Bộ trưởng Bộ Văn hóa. Ngày 12 tháng 8 năm 2009, Thủ tướng Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam đã ký Quyết định số 1272/QĐ-TTg xếp hạng Di tích lịch sử Dinh Độc Lập là một trong 10 di tích quốc gia đặc biệt đầu tiên của cả nước.	https://s3.cloudfly.vn/travellens/view360-audio/1781967828429-Dinh-c-L-p.mp3	Vietnamese	Dinh Độc Lập	0	2026-06-20 15:03:56.6831	2026-06-20 15:03:56.6831	\N
1	1	360 experience at the main gate	https://example.com/audio-url.mp3	vi	Main Gate 360 View	1	2026-05-25 14:11:06.517658	2026-06-23 19:58:10.472888	2026-06-23 19:58:10.472888
4	5	vgdvsdcg	https://s3.cloudfly.vn/travellens/view360-audio/1782286844813-Dinh-c-L-p.mp3	Vietnamese	Test	0	2026-06-24 07:40:48.132357	2026-06-24 07:40:48.132357	\N
5	7	Toạ lạc tại số 600 Nguyễn Văn Cừ nối dài, TP Cần Thơ, Trường Đại học FPT trở thành một không gian học tập chuẩn quốc tế dành cho sinh viên ngay tại Đồng bằng Sông Cửu Long với các nhóm ngành Công Nghệ Thông Tin, Quản trị kinh doanh, Công nghệ Truyền thông, Luật và Ngôn ngữ. Với phương châm Trải nghiệm để thành công, Trường Đại học FPT tự hào mang đến cho sinh viên một môi trường học tập đa trải nghiệm với 3 trụ cột chính Công nghệ, Quốc tế và Khởi nghiệp, cung cấp cho thị trường lao động nguồn nhân lực chất lượng cao, sở hữu đầy đủ các phẩm chất cần thiết từ kiến thức chuyên môn, kỹ năng mềm đến tư duy công nghệ và thái độ chuyên nghiệp trong công việc.	https://s3.cloudfly.vn/travellens/view360-audio/1782917223358-Ki-u_Nhi_To-_l-c_t-i_s-_600_4589346ef301.mp3	Vietnamese	FPT	0	2026-07-01 21:47:16.872006	2026-07-20 09:26:18.539696	\N
6	8	Tòa nhà hiệu bộ Alpha tại campus Cần Thơ có tổng diện tích sàn xây dựng gần 25.000 m2. Kết cấu gồm 1 tầng bán hầm, 9 tầng nổi và tum thang có mái che. Công trình có kiến trúc mặt đứng, thiết kế đồng điệu với tổng thể các tòa nhà khác và lấy ý tưởng chính từ họa tiết Penrose.\r\n\r\nQuy mô gồm 136 phòng học và phòng chức năng, đáp ứng nhu cầu học tập và sinh hoạt của hơn 5.000 cán bộ, giáo viên, sinh viên. Tòa nhà được kỳ vọng sẽ góp phần giúp nhà trường thực hiện tốt sứ mệnh cung cấp nguồn nhân lực số nhạy bén với cuộc cách mạng 4.0, giỏi về khoa học - công nghệ, qua đó cung ứng nguồn lao động chất lượng cao cho Đồng bằng sông Cửu Long.	https://s3.cloudfly.vn/travellens/view360-audio/1784515969258-T-a-Alpha-H-fpt-c-n-th.mp3	Vietnamese	Sảnh Tòa Alpha ĐH fpt cần thơ	0	2026-07-20 09:52:52.247056	2026-07-20 10:00:36.159834	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__view360_hotspot; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__view360_hotspot (hotspot_id, view360_id, type, title, description, yaw, pitch, target_view360_id, target_url, order_index, is_active, created_at, updated_at, deleted_at) FROM stdin;
3	5	info	Tòa Beta	\N	162.4000	6.4000	\N	\N	0	t	2026-07-20 09:25:51.466847	2026-07-20 09:25:51.466847	\N
5	5	info	Sân Bóng	\N	127.8000	-33.2000	\N	\N	0	t	2026-07-20 09:26:14.024296	2026-07-20 09:26:14.024296	\N
2	5	location	Tòa Gramma	Phường An Bình, Quận Ninh Kiều và Phường Long Tuyền, Quận Bình Thủy, TP. Cần Thơ	113.9000	19.0000	\N	\N	0	t	2026-07-20 09:25:33.769355	2026-07-20 09:28:50.200423	\N
4	5	navigation	Tòa Alpha	Tòa nhà hiệu bộ Alpha tại campus Cần Thơ có tổng diện tích sàn xây dựng gần 25.000 m2. Kết cấu gồm 1 tầng bán hầm, 9 tầng nổi và tum thang có mái che. Công trình có kiến trúc mặt đứng, thiết kế đồng điệu với tổng thể các tòa nhà khác và lấy ý tưởng chính từ họa tiết Penrose.\n\nQuy mô gồm 136 phòng học và phòng chức năng, đáp ứng nhu cầu học tập và sinh hoạt của hơn 5.000 cán bộ, giáo viên, sinh viên. Tòa nhà được kỳ vọng sẽ góp phần giúp nhà trường thực hiện tốt sứ mệnh cung cấp nguồn nhân lực số nhạy bén với cuộc cách mạng 4.0, giỏi về khoa học - công nghệ, qua đó cung ứng nguồn lao động chất lượng cao cho Đồng bằng sông Cửu Long.	220.9000	25.3000	6	\N	0	t	2026-07-20 09:26:03.871245	2026-07-20 09:55:43.550221	\N
\.


--
-- Data for Name: pre_normalize_20260722_000005__view360_image; Type: TABLE DATA; Schema: data_backups; Owner: -
--

COPY data_backups.pre_normalize_20260722_000005__view360_image (image_id, view_id, image_file, order_index, created_at, updated_at, deleted_at) FROM stdin;
3	3	https://s3.cloudfly.vn/travellens/view360-images/1781967839780-captured-just-as-peak-hour-begins-the-calm-and-tranquility-of-the-river-on-one-side-is-in-stark-contrast-to-the-hustle-and-bustle-of-the-cbd-2DH8Y78.jpg	1	2026-06-20 15:04:18.933714	2026-06-20 15:04:18.933714	\N
1	1	https://example.com/image-360-url.jpg	1	2026-05-25 14:11:34.219139	2026-06-22 08:34:20.031758	2026-06-22 08:34:20.031758
4	1	https://s3.cloudfly.vn/travellens/view360-images/1782117264435-khong-su-dung.png	1	2026-06-22 08:34:27.872756	2026-06-23 19:58:10.472888	2026-06-23 19:58:10.472888
5	4	https://s3.cloudfly.vn/travellens/view360-images/1782286851180-captured-just-as-peak-hour-begins-the-calm-and-tranquility-of-the-river-on-one-side-is-in-stark-contrast-to-the-hustle-and-bustle-of-the-cbd-2DH8Y78.jpg	1	2026-06-24 07:40:54.141238	2026-06-24 07:40:54.141238	\N
6	5	https://s3.cloudfly.vn/travellens/view360-images/1782917241262-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	1	2026-07-01 21:47:24.780378	2026-07-01 21:47:24.780378	\N
7	6	https://s3.cloudfly.vn/travellens/view360-images/1784516090936-screenshot1.jpg	1	2026-07-20 09:54:54.244358	2026-07-20 09:57:31.577939	2026-07-20 09:57:31.577939
8	6	https://s3.cloudfly.vn/travellens/view360-images/1784515976791-screenshot1.jpg	1	2026-07-20 09:56:09.319432	2026-07-20 09:57:33.709003	2026-07-20 09:57:33.709003
9	6	https://s3.cloudfly.vn/travellens/view360-images/1784516259925-ChatGPT-Image-09_56_43-20-thg-7-2026.png	1	2026-07-20 09:57:43.708189	2026-07-20 10:00:37.472475	2026-07-20 10:00:37.472475
10	6	https://s3.cloudfly.vn/travellens/view360-images/1784516441051-ChatGPT-Image-09_56_43-20-thg-7-2026.jpg	1	2026-07-20 10:01:02.042252	2026-07-20 10:01:02.042252	\N
2	2	https://s3.cloudfly.vn/travellens/view360-images/1781939578897-v2osk-P_hTMaVlkzk-unsplash.jpg	1	2026-06-20 07:13:03.953324	2026-07-20 15:00:45.17435	2026-07-20 15:00:45.17435
11	2	https://s3.cloudfly.vn/travellens/view360-images/1784534451072-picture3-17171710448722083760711.png	1	2026-07-20 15:01:32.504638	2026-07-20 15:01:32.504638	\N
\.


--
-- Data for Name: ai_chat_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_chat_history (chat_id, user_id, role, content, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: ai_search_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ai_search_history (id, user_id, travel_request, parsed_data, recommendations, model_version, created_at) FROM stdin;
7	58	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 5 triệu mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 5000000}	[{"name": "Dinh Độc Lập", "score": 0.640778, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}, {"name": "Bến Nhà Rồng", "score": 0.359222, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-18 18:18:56.791101
8	58	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 3 nghìn mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 3000}	[{"name": "Bến Nhà Rồng", "score": 0.77, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.23, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-18 18:20:08.886673
9	59	Tôi muốn đi biển cùng bạn bè gồm 9 người, ngân sách khoảng 4 triệu cho mỗi người	{"pax": 9, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 4000000}	[{"name": "Bến Nhà Rồng", "score": 0.801667, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.198333, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-19 19:58:16.011923
10	2	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 3 nghìn mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 3000}	[{"name": "Bến Nhà Rồng", "score": 0.77, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.23, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-19 21:19:30.952393
11	2	Tôi muốn đi biển cùng gia đình 4 người, ngân sách khoảng 3 nghìn mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 3000}	[{"name": "Bến Nhà Rồng", "score": 0.77, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.23, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-20 16:27:33.78879
12	2	tôi và người yêu 2 người với tài chính 800k muốn đi chơi	{"pax": 2, "tour_type": "City Break", "cust_segment": "Young Professional", "budget_per_person_vnd": 800000}	[{"name": "Bến Nhà Rồng", "score": 0.735, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}, {"name": "Dinh Độc Lập", "score": 0.265, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-21 20:41:53.563924
13	2	Gia đình 4 người muốn đi biển, ngân sách 5 triệu mỗi người.	{"pax": 4, "tour_type": "Beach", "cust_segment": "Family", "budget_per_person_vnd": 5000000}	[{"name": "Dinh Độc Lập", "score": 0.640778, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "Updated historic landmark description", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "3532", "suggested_tour_type": "Lịch Sử"}, {"name": "Bến Nhà Rồng", "score": 0.359222, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781623676763-Screenshot-2025-08-26-223211.png", "description": "Historic landmark in Ho Chi Minh City<img src=\\"https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" alt=\\"The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg\\" loading=\\"lazy\\" /><p><img src=\\"https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png\\" alt=\\"Createbookingt.drawio.png\\" loading=\\"lazy\\" /></p><p><br /></p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "3000", "suggested_tour_type": "Lịch Sử"}]	2026-07-13-v1	2026-07-21 20:45:43.779428
14	2	Tôi muốn đi biển cùng bạn bè gồm 9 người, ngân sách khoảng 4 triệu cho mỗi người	{"pax": 9, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 4000000}	[{"name": "Bến Nhà Rồng – Bảo tàng Hồ Chí Minh", "score": 0.801667, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg", "description": "<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "350000", "suggested_tour_type": "Lịch sử"}, {"name": "Dinh Độc Lập", "score": 0.198333, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "690000", "suggested_tour_type": "Lịch sử"}]	2026-07-13-v1	2026-07-22 13:04:47.351229
15	2	Tôi muốn đi biển cùng bạn bè gồm 9 người, ngân sách khoảng 15 triệu cho mỗi người	{"pax": 9, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 15000000}	[{"name": "Bến Nhà Rồng – Bảo tàng Hồ Chí Minh", "score": 0.801667, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg", "description": "<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "350000", "suggested_tour_type": "Lịch sử"}, {"name": "Dinh Độc Lập", "score": 0.198333, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "690000", "suggested_tour_type": "Lịch sử"}]	2026-07-13-v1	2026-07-22 13:05:05.172751
16	59	Tôi muốn đi biển cùng bạn bè gồm 2 người, ngân sách khoảng 15 triệu cho mỗi người	{"pax": 2, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 15000000}	[{"name": "Bến Nhà Rồng – Bảo tàng Hồ Chí Minh", "score": 0.735, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg", "description": "<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "350000", "suggested_tour_type": "Lịch sử"}, {"name": "Dinh Độc Lập", "score": 0.265, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "690000", "suggested_tour_type": "Lịch sử"}]	2026-07-13-v1	2026-07-22 13:07:11.382259
17	59	Tôi muốn đi nghỉ dưỡng cùng bạn bè gồm 2 người, ngân sách khoảng 15 triệu cho mỗi người	{"pax": 2, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 15000000}	[{"name": "Bến Nhà Rồng – Bảo tàng Hồ Chí Minh", "score": 0.735, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg", "description": "<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "350000", "suggested_tour_type": "Lịch sử"}, {"name": "Dinh Độc Lập", "score": 0.265, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "690000", "suggested_tour_type": "Lịch sử"}]	2026-07-13-v1	2026-07-22 13:07:42.789985
19	59	Tôi muốn đi nghỉ dưỡng cùng bạn bè gồm 2 người, ngân sách khoảng 15 triệu cho mỗi người	{"pax": 2, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 15000000}	[{"name": "Bến Nhà Rồng – Bảo tàng Hồ Chí Minh", "score": 0.735, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg", "description": "<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "350000", "suggested_tour_type": "Lịch sử"}, {"name": "Dinh Độc Lập", "score": 0.265, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "690000", "suggested_tour_type": "Lịch sử"}]	2026-07-13-v1	2026-07-22 13:08:43.346294
20	59	Tôi muốn đi nghỉ dưỡng cùng bạn bè gồm 2 người, ngân sách khoảng 15 triệu cho mỗi người	{"pax": 2, "tour_type": "Beach", "cust_segment": "Young Professional", "budget_per_person_vnd": 15000000}	[{"name": "Bà Nà Hills", "score": 0.84, "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg", "description": "<p>Bà Nà Hills là điểm tham quan nổi bật, mang giá trị đặc trưng về giải trí và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>", "detail_link": "/destinations/73", "destination_id": 73, "starting_price": "3590000", "suggested_tour_type": "Giải trí"}, {"name": "Bãi Sao Phú Quốc", "score": 0.16, "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg", "description": "<p>Bãi Sao Phú Quốc là điểm tham quan nổi bật, mang giá trị đặc trưng về biển đảo và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>", "detail_link": "/destinations/78", "destination_id": 78, "starting_price": "3290000", "suggested_tour_type": "Biển đảo"}, {"name": "Dinh Độc Lập", "score": 0, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png", "description": "<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>", "detail_link": "/destinations/2", "destination_id": 2, "starting_price": "690000", "suggested_tour_type": "Lịch sử"}, {"name": "Bến Nhà Rồng – Bảo tàng Hồ Chí Minh", "score": 0, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg", "description": "<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>", "detail_link": "/destinations/3", "destination_id": 3, "starting_price": "350000", "suggested_tour_type": "Lịch sử"}, {"name": "Làng du lịch sinh thái Ông Đề", "score": 0, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1782231791429-langdulichsinhthaiongde-2-5737.jpg", "description": "<p>Làng du lịch sinh thái Ông Đề tại Phong Điền, Cần Thơ mang đến trải nghiệm miệt vườn, trò chơi dân gian, ẩm thực miền Tây và các hoạt động tập thể gần gũi thiên nhiên.</p>", "detail_link": "/destinations/6", "destination_id": 6, "starting_price": null, "suggested_tour_type": "Sinh thái"}, {"name": "Trường Đại học FPT Cần Thơ", "score": 0, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1782244022126-picture3-17171710448722083760711.png", "description": "<p>Trường Đại học FPT Cần Thơ tọa lạc tại số 600 Nguyễn Văn Cừ nối dài. Khuôn viên nổi bật với kiến trúc hiện đại, không gian xanh và môi trường học tập gắn với công nghệ, quốc tế hóa và khởi nghiệp.</p>", "detail_link": "/destinations/7", "destination_id": 7, "starting_price": "350000", "suggested_tour_type": "Sinh thái"}, {"name": "Dinh Độc Lập – Không gian trưng bày", "score": 0, "thumbnail": "https://s3.cloudfly.vn/travellens/travel-destinations/1782286635854-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg", "description": "<p>Không gian trưng bày tại Dinh Độc Lập giúp du khách tìm hiểu sâu hơn về lịch sử, kiến trúc và những sự kiện quan trọng diễn ra tại công trình này.</p>", "detail_link": "/destinations/8", "destination_id": 8, "starting_price": null, "suggested_tour_type": "Lịch sử"}, {"name": "Bến Ninh Kiều", "score": 0, "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg", "description": "<p>Bến Ninh Kiều nằm bên dòng Hậu Giang, là biểu tượng du lịch của Cần Thơ với công viên ven sông, cầu đi bộ và khu chợ đêm sôi động.</p>", "detail_link": "/destinations/33", "destination_id": 33, "starting_price": "1690000", "suggested_tour_type": "Sinh thái"}, {"name": "Chợ nổi Cái Răng", "score": 0, "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg", "description": "<p>Chợ nổi Cái Răng là không gian giao thương đặc trưng của miền Tây, nhộn nhịp từ sáng sớm với ghe thuyền bán trái cây, nông sản và món ăn địa phương.</p>", "detail_link": "/destinations/34", "destination_id": 34, "starting_price": "650000", "suggested_tour_type": "Sinh thái"}, {"name": "Nhà cổ Bình Thủy", "score": 0, "thumbnail": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg", "description": "<p>Nhà cổ Bình Thủy được xây dựng vào cuối thế kỷ XIX, nổi bật với sự giao thoa giữa kiến trúc Pháp và không gian sinh hoạt truyền thống Nam Bộ.</p>", "detail_link": "/destinations/35", "destination_id": 35, "starting_price": "590000", "suggested_tour_type": "Sinh thái"}]	2026-07-22-v1	2026-07-22 13:24:57.103282
\.


--
-- Data for Name: blog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog (blog_id, user_id, title, content, date_created, slug, thumbnail, status, published_at) FROM stdin;
2	2	Một Ngày Khám Phá FPT University Cần Thơ	<p>Nếu có dịp đến Cần Thơ, bạn có thể dành một buổi tham quan khuôn viên Trường Đại học FPT. Tòa Alpha và Gamma nổi bật với kiến trúc hiện đại, nhiều mảng xanh và không gian mở.</p><h2>Lịch trình gợi ý</h2><p>Bắt đầu từ khu giới thiệu, tiếp tục tham quan các tòa nhà học tập và dành thời gian trò chuyện cùng sinh viên để hiểu hơn về đời sống tại campus.</p>	2026-06-23	mot-ngay-kham-pha-fpt-university-can-tho	\N	published	2026-06-23 00:00:00
3	2	Những Góc Check-in Đẹp Tại FPT Cần Thơ	<p>FPT Cần Thơ có nhiều góc kiến trúc hiện đại, đặc biệt tại tòa Alpha và các khoảng sân xanh giữa campus.</p><p>Nên ghé vào buổi sáng hoặc cuối chiều để có ánh sáng đẹp và thời tiết dễ chịu.</p>	2026-06-23	nhung-goc-check-in-dep-tai-fpt-can-tho	\N	published	2026-06-23 00:00:00
9	51	Bến Ninh Kiều – Biểu Tượng Của Cần Thơ	<p>Nằm bên dòng Hậu Giang, Bến Ninh Kiều là nơi lý tưởng để cảm nhận nhịp sống Cần Thơ. Khu vực này có công viên, cầu đi bộ, chợ đêm và nhiều nhà hàng phục vụ đặc sản miền Tây.</p><p>Thời điểm đẹp nhất để ghé thăm là cuối buổi chiều và buổi tối.</p>	2026-06-24	ben-ninh-kieu-bieu-tuong-cua-can-tho	\N	published	2026-06-23 10:00:00
5	50	Bình Minh Trên Chợ Nổi Cái Răng	<p>Chợ nổi Cái Răng nhộn nhịp nhất từ sáng sớm. Khi mặt trời vừa lên, những chiếc ghe chở đầy trái cây và nông sản tạo nên khung cảnh sông nước rất đặc trưng.</p><h2>Kinh nghiệm</h2><p>Hãy xuất phát trước 6 giờ, mặc áo phao và chọn đơn vị vận chuyển uy tín. Đừng quên thử cà phê hoặc bún riêu được phục vụ ngay trên ghe.</p>	2026-06-23	binh-minh-tren-cho-noi-cai-rang	\N	published	2026-06-22 10:00:00
6	50	Một Buổi Chiều Yên Bình Tại Bến Ninh Kiều	<p>Bến Ninh Kiều là biểu tượng quen thuộc của Cần Thơ. Buổi chiều, không khí mát hơn và ánh hoàng hôn phủ lên dòng Hậu Giang tạo nên khung cảnh rất thư thái.</p><p>Bạn có thể đi bộ dọc công viên, ghé chợ đêm và thưởng thức các món ăn địa phương.</p>	2026-06-23	mot-buoi-chieu-yen-binh-tai-ben-ninh-kieu	\N	published	2026-06-23 00:00:00
10	2	Hòn Sơn – Viên Ngọc Xanh Của Kiên Giang	<p>Hòn Sơn hấp dẫn bởi nước biển trong, những rặng dừa ven bờ và nhịp sống làng chài bình dị. Du khách có thể tắm biển, trekking Ma Thiên Lãnh và thưởng thức hải sản tươi.</p><p>Nên kiểm tra thời tiết trước chuyến đi và đặt vé tàu sớm vào cuối tuần.</p>	2026-07-05	hon-son-vien-ngoc-xanh-kien-giang	\N	published	2026-07-05 16:36:14.689
11	58	Hành Trình Khám Phá Miền Tây Bằng Phương Tiện Công Cộng	<p>Di chuyển bằng xe buýt và xe khách giúp chuyến đi miền Tây tiết kiệm hơn, đồng thời mang đến cơ hội quan sát nhịp sống địa phương.</p><p>Hãy chuẩn bị lịch trình linh hoạt, kiểm tra giờ chạy và ưu tiên hành lý gọn nhẹ.</p>	2026-07-19	hanh-trinh-kham-pha-mien-tay-bang-phuong-tien-cong-cong	\N	published	2026-07-19 22:54:00
16	1	Kinh Nghiệm Đi Chợ Nổi Cái Răng Từ Sáng Sớm	<p>Chợ nổi hoạt động nhộn nhịp nhất từ 5 đến 7 giờ sáng. Bạn nên đặt thuyền trước, mặc áo phao và chuẩn bị áo khoác mỏng.</p><h2>Những món nên thử</h2><p>Cà phê kho, hủ tiếu và trái cây theo mùa là những trải nghiệm không nên bỏ lỡ.</p>	2026-07-22	kinh-nghiem-di-cho-noi-cai-rang	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	published	2026-07-21 00:08:34.293735
17	3	Một Buổi Tối Dạo Bến Ninh Kiều	<p>Khi thành phố lên đèn, Bến Ninh Kiều trở nên nhộn nhịp với cầu đi bộ, chợ đêm và các hàng quán đặc sản.</p><p>Hãy dành thời gian đi bộ ven sông và ngắm tàu thuyền trên dòng Hậu Giang.</p>	2026-07-22	mot-buoi-toi-dao-ben-ninh-kieu	https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=85	published	2026-07-20 00:08:34.293735
18	5	Nhà Cổ Bình Thủy và Dấu Ấn Kiến Trúc Nam Bộ	<p>Ngôi nhà gây ấn tượng bởi mặt tiền kiểu Pháp nhưng vẫn giữ cách bố trí và không gian thờ tự truyền thống của người Nam Bộ.</p><p>Nên tham quan cùng thuyết minh viên để hiểu rõ hơn về lịch sử gia đình và từng món nội thất.</p>	2026-07-22	nha-co-binh-thuy-va-kien-truc-nam-bo	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	published	2026-07-19 00:08:34.293735
19	10	Cồn Sơn – Một Ngày Làm Người Miệt Vườn	<p>Cồn Sơn mang đến trải nghiệm gần gũi qua vườn trái cây, bè cá và các lớp làm bánh dân gian.</p><p>Du lịch cộng đồng tại đây tạo cảm giác thân tình, chậm rãi và rất phù hợp cho gia đình.</p>	2026-07-22	con-son-mot-ngay-lam-nguoi-miet-vuon	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	published	2026-07-18 00:08:34.293735
35	1	Cẩm Nang Khám Phá Văn Miếu – Quốc Tử Giám	<p>Văn Miếu – Quốc Tử Giám mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-van-mieu-quoc-tu-giam	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	published	2026-07-21 00:15:54.274445
36	3	Cẩm Nang Khám Phá Hoàng thành Thăng Long	<p>Hoàng thành Thăng Long mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-hoang-thanh-thang-long	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	published	2026-07-20 00:15:54.274445
45	59	Cẩm Nang Khám Phá Bãi Sao Phú Quốc	<p>Bãi Sao Phú Quốc mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-bai-sao-phu-quoc	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	published	2026-07-11 00:15:54.274445
37	5	Cẩm Nang Khám Phá Đại Nội Huế	<p>Đại Nội Huế mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-dai-noi-hue	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	published	2026-07-19 00:15:54.274445
38	10	Cẩm Nang Khám Phá Chùa Thiên Mụ	<p>Chùa Thiên Mụ mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-chua-thien-mu	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	published	2026-07-18 00:15:54.274445
39	11	Cẩm Nang Khám Phá Phố cổ Hội An	<p>Phố cổ Hội An mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-pho-co-hoi-an	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	published	2026-07-17 00:15:54.274445
40	50	Cẩm Nang Khám Phá Bà Nà Hills	<p>Bà Nà Hills mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-ba-na-hills	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	published	2026-07-16 00:15:54.274445
41	55	Cẩm Nang Khám Phá Chợ Bến Thành	<p>Chợ Bến Thành mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-cho-ben-thanh	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	published	2026-07-15 00:15:54.274445
42	56	Cẩm Nang Khám Phá Bảo tàng Mỹ thuật	<p>Bảo tàng Mỹ thuật mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-bao-tang-my-thuat	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	published	2026-07-14 00:15:54.274445
43	57	Cẩm Nang Khám Phá Núi Bà Đen	<p>Núi Bà Đen mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-nui-ba-den	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	published	2026-07-13 00:15:54.274445
44	58	Cẩm Nang Khám Phá Tràm Chim	<p>Tràm Chim mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-tram-chim	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	published	2026-07-12 00:15:54.274445
46	60	Cẩm Nang Khám Phá Làng chài Hàm Ninh	<p>Làng chài Hàm Ninh mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-lang-chai-ham-ninh	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	published	2026-07-10 00:15:54.274445
47	61	Cẩm Nang Khám Phá Vườn quốc gia Cát Tiên	<p>Vườn quốc gia Cát Tiên mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-vuon-quoc-gia-cat-tien	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	published	2026-07-09 00:15:54.274445
48	62	Cẩm Nang Khám Phá Ẩm thực Sài Gòn	<p>Ẩm thực Sài Gòn mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-am-thuc-sai-gon	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	published	2026-07-08 00:15:54.274445
49	63	Cẩm Nang Khám Phá Kinh nghiệm đặt tour gia đình	<p>Kinh nghiệm đặt tour gia đình mang đến nhiều trải nghiệm đặc trưng về cảnh quan, văn hóa và đời sống địa phương.</p><h2>Kinh nghiệm tham quan</h2><p>Nên kiểm tra giờ mở cửa, chuẩn bị trang phục phù hợp và đặt dịch vụ sớm vào mùa cao điểm.</p><h2>Gợi ý lịch trình</h2><p>Hãy bắt đầu vào buổi sáng, dành thời gian thưởng thức ẩm thực và ưu tiên phương tiện công cộng khi có thể.</p>	2026-07-22	cam-nang-kham-pha-kinh-nghiem-dat-tour-gia-dinh	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	published	2026-07-07 00:15:54.274445
\.


--
-- Data for Name: blog_blog_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_blog_category (blog_id, blog_category_id) FROM stdin;
9	1
5	2
16	2
17	2
18	2
19	2
35	25
35	26
36	26
36	27
37	27
37	28
38	28
38	29
39	29
39	30
40	30
40	31
41	31
41	25
42	25
42	26
43	26
43	27
44	27
44	28
45	28
45	29
46	29
46	30
47	30
47	31
48	31
48	25
49	25
49	26
\.


--
-- Data for Name: blog_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_category (blog_category_id, name, description, created_at, updated_at) FROM stdin;
1	Khuyến mãi	Ưu đãi, chương trình giảm giá và kinh nghiệm săn deal.	2026-07-04 21:52:22.703644	2026-07-04 21:52:22.703644
2	Tin tức	Tin tức và cập nhật mới về du lịch.	2026-07-18 22:25:30.504853	2026-07-18 22:25:30.504853
25	Cẩm nang	Hướng dẫn chuẩn bị và kinh nghiệm thực tế cho chuyến đi.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
26	Điểm đến	Thông tin chi tiết và gợi ý khám phá từng điểm đến.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
27	Ẩm thực	Món ngon, địa chỉ ăn uống và câu chuyện ẩm thực.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
28	Văn hóa	Phong tục, di sản và đời sống cộng đồng địa phương.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
29	Lịch trình	Lịch trình mẫu theo ngày và theo chủ đề.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
30	Mẹo du lịch	Mẹo đặt dịch vụ, di chuyển và quản lý chi phí.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
31	Trải nghiệm	Câu chuyện và cảm nhận chân thực từ hành trình.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
\.


--
-- Data for Name: blog_comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_comment (comment_id, blog_id, user_id, content, status, created_at, updated_at, deleted_at, parent_comment_id) FROM stdin;
1	5	55	leader đẹp trai	approved	2026-07-03 00:04:38.810623	2026-07-03 00:17:37.34146	\N	\N
2	5	55	như trên	approved	2026-07-03 00:10:02.432082	2026-07-03 00:19:38.537303	2026-07-03 00:19:38.537303	1
3	9	58	okokok	approved	2026-07-04 21:13:16.159472	2026-07-04 21:13:16.159472	\N	\N
10	16	3	Bài viết hữu ích, mình đã lưu lại cho chuyến đi sắp tới.	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N
11	17	5	Bài viết hữu ích, mình đã lưu lại cho chuyến đi sắp tới.	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N
12	18	10	Bài viết hữu ích, mình đã lưu lại cho chuyến đi sắp tới.	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N
13	19	11	Bài viết hữu ích, mình đã lưu lại cho chuyến đi sắp tới.	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N
\.


--
-- Data for Name: blog_location; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_location (blog_id, location_id) FROM stdin;
2	4
3	4
6	5
9	3
9	5
10	5
5	1
5	3
5	8
5	7
5	4
5	5
11	7
16	57
17	59
18	61
19	63
35	127
36	128
37	129
38	130
39	131
40	132
41	133
42	134
43	135
44	136
45	137
46	138
47	139
48	140
49	141
\.


--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.booking (booking_id, user_id, tour_id, status, payment_status, date_created, coupon_id, original_amount, discount_amount, final_amount, canceled_at, canceled_by, cancel_reason, departure_at, contact_phone, currency, created_at) FROM stdin;
90	1	36	confirmed	paid	2026-07-22	19	2780000	417000	2363000	\N	\N	\N	2026-08-01 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
91	3	37	confirmed	paid	2026-07-21	\N	650000	0	650000	\N	\N	\N	2026-08-02 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
93	10	41	confirmed	paid	2026-07-19	19	4290000	500000	3790000	\N	\N	\N	2026-08-04 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
94	11	38	canceled	refunded	2026-07-18	\N	980000	0	980000	2026-07-20 00:08:34.293735	4	Khách thay đổi kế hoạch cá nhân	2026-08-05 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
95	1	40	waiting_manual_confirmation	pending	2026-07-17	\N	1290000	0	1290000	\N	\N	\N	2026-08-06 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
96	3	39	confirmed	paid	2026-07-16	19	2070000	310500	1759500	\N	\N	\N	2026-08-07 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
97	5	36	expired	failed	2026-07-15	\N	1690000	0	1690000	\N	\N	\N	2026-08-08 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
98	10	37	cancel_pending	paid	2026-07-14	\N	1070000	0	1070000	\N	\N	\N	2026-08-09 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
99	11	41	confirmed	paid	2026-07-13	19	7180000	500000	6680000	\N	\N	\N	2026-08-10 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
69	58	6	expired	unpaid	2026-07-21	9	700000	3000	697000	\N	\N	\N	2026-07-24 09:00:00	0333622144	VND	2026-07-21 01:26:33.332753
92	5	39	expired	unpaid	2026-07-20	\N	1480000	0	1480000	\N	\N	\N	2026-08-03 00:08:34.293735	0900000000	VND	2026-07-22 00:08:34.293735
68	58	6	confirmed	paid	2026-07-20	\N	350000	0	350000	\N	\N	\N	2026-07-23 09:00:00	0333622144	VND	2026-07-20 16:22:37.700138
30	57	2	expired	failed	2026-06-29	\N	890000	0	890000	\N	\N	\N	\N	\N	VND	2026-06-29 00:00:00
22	51	6	confirmed	paid	2026-06-27	\N	350000	0	350000	\N	\N	\N	\N	\N	VND	2026-06-27 00:00:00
13	50	4	expired	unpaid	2026-06-23	\N	4540000	0	4540000	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
73	58	6	expired	failed	2026-07-21	9	700000	3000	697000	\N	\N	\N	2026-07-25 09:00:00	0333622144	VND	2026-07-21 15:41:18.080933
31	57	6	canceled	refunded	2026-06-29	\N	350000	0	350000	2026-06-29 17:02:49.832827	57	\N	2026-07-02 09:00:00	\N	VND	2026-06-29 00:00:00
23	51	6	confirmed	paid	2026-06-27	\N	350000	0	350000	\N	\N	\N	\N	\N	VND	2026-06-27 00:00:00
20	51	2	expired	failed	2026-06-24	9	890000	10000	880000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
17	51	2	canceled	unpaid	2026-06-24	8	1780000	100000	1680000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
11	50	4	canceled	unpaid	2026-06-23	\N	4540000	0	4540000	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
18	51	6	canceled	failed	2026-06-24	\N	350000	0	350000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
42	57	4	expired	failed	2026-06-29	\N	1250000	0	1250000	\N	\N	\N	2026-07-04 01:00:00	\N	VND	2026-06-29 00:00:00
16	50	2	expired	unpaid	2026-06-24	\N	890000	0	890000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
53	58	4	confirmed	paid	2026-06-30	9	2040000	2914	2037086	\N	\N	\N	2026-07-11 01:00:00	\N	VND	2026-06-30 00:00:00
45	58	6	confirmed	paid	2026-06-30	9	600000	2475	597525	\N	\N	\N	2026-07-02 02:00:00	\N	VND	2026-06-30 00:00:00
10	1	1	confirmed	paid	2026-06-02	\N	690000	0	690000	\N	\N	\N	\N	\N	VND	2026-06-02 00:00:00
74	58	6	confirmed	paid	2026-07-21	9	700000	3000	697000	\N	\N	\N	2026-07-22 09:00:00	0333622144	VND	2026-07-21 16:10:34.02564
59	58	1	confirmed	paid	2026-07-01	11	1830000	366000	1464000	\N	\N	\N	2026-07-30 01:00:00	\N	VND	2026-07-01 00:00:00
38	57	6	expired	failed	2026-06-29	11	1800000	21000	1779000	\N	\N	\N	2026-07-02 02:00:00	\N	VND	2026-06-29 00:00:00
34	57	6	cancel_pending	paid	2026-06-29	\N	350000	0	350000	\N	\N	\N	2026-07-01 09:00:00	\N	VND	2026-06-29 00:00:00
58	58	6	expired	failed	2026-07-01	9	350000	1500	348500	\N	\N	\N	2026-07-15 02:00:00	\N	VND	2026-07-01 00:00:00
61	57	2	expired	failed	2026-07-02	10	890000	178000	712000	\N	\N	\N	2026-07-04 08:00:00	\N	VND	2026-07-02 00:00:00
14	50	4	expired	unpaid	2026-06-23	\N	2500000	0	2500000	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
60	58	2	confirmed	paid	2026-07-01	11	2370000	474000	1896000	\N	\N	\N	2026-07-14 01:00:00	\N	VND	2026-07-01 00:00:00
21	51	4	confirmed	paid	2026-06-24	\N	1250000	0	1250000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
7	1	1	confirmed	paid	2026-06-01	5	690000	1500	688500	\N	\N	\N	\N	\N	VND	2026-06-01 00:00:00
160	1	72	confirmed	paid	2026-07-22	28	1290000	129000	1161000	\N	\N	\N	2026-08-03 00:15:54.274445	0901234567	VND	2026-07-22 00:15:54.274445
161	3	73	confirmed	paid	2026-07-21	\N	1310000	0	1310000	\N	\N	\N	2026-08-04 00:15:54.274445	0763388151	VND	2026-07-22 00:15:54.274445
163	10	75	expired	failed	2026-07-19	28	4690000	300000	4390000	\N	\N	\N	2026-08-06 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
164	11	76	canceled	unpaid	2026-07-18	\N	1640000	0	1640000	2026-07-21 00:15:54.274445	4	Khách thay đổi lịch trình cá nhân	2026-08-07 00:15:54.274445	0901234567	VND	2026-07-22 00:15:54.274445
165	50	77	waiting_manual_confirmation	pending	2026-07-17	\N	8370000	0	8370000	\N	\N	\N	2026-08-08 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
166	55	78	confirmed	paid	2026-07-16	28	890000	89000	801000	\N	\N	\N	2026-08-09 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
167	56	79	confirmed	paid	2026-07-15	\N	1440000	0	1440000	\N	\N	\N	2026-08-10 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
63	58	6	confirmed	paid	2026-07-19	9	950000	3975	946025	\N	\N	\N	2026-07-30 09:00:00	0333622144	VND	2026-07-19 22:24:01.622641
65	57	6	canceled	refunded	2026-07-20	\N	350000	0	350000	2026-07-20 13:51:17.844299	4	sdfg	2026-07-25 09:00:00	0763388155	VND	2026-07-20 13:46:43.747006
47	58	4	expired	failed	2026-06-30	\N	2040000	0	2040000	\N	\N	\N	2026-07-01 01:00:00	\N	VND	2026-06-30 00:00:00
55	58	1	confirmed	paid	2026-07-01	11	1830000	366000	1464000	\N	\N	\N	2026-07-30 01:00:00	\N	VND	2026-07-01 00:00:00
50	58	6	confirmed	paid	2026-06-30	\N	600000	0	600000	\N	\N	\N	2026-07-01 02:00:00	\N	VND	2026-06-30 00:00:00
39	57	6	expired	failed	2026-06-29	10	3700000	53460	3646540	\N	\N	\N	2026-07-04 02:00:00	\N	VND	2026-06-29 00:00:00
56	58	4	canceled	paid	2026-07-01	\N	1250000	0	1250000	2026-07-02 14:53:43.9381	2	nghèo hết tiền	2026-07-22 01:00:00	\N	VND	2026-07-01 00:00:00
37	57	6	expired	failed	2026-06-29	\N	350000	0	350000	\N	\N	\N	2026-07-01 09:00:00	\N	VND	2026-06-29 00:00:00
43	58	6	confirmed	paid	2026-06-29	\N	600000	0	600000	\N	\N	\N	2026-07-05 02:00:00	\N	VND	2026-06-29 00:00:00
64	58	6	expired	failed	2026-07-20	\N	350000	0	350000	\N	\N	\N	2026-07-22 09:00:00	0333622144	VND	2026-07-20 03:17:35.005451
36	57	6	expired	failed	2026-06-29	\N	350000	0	350000	\N	\N	\N	2026-07-01 09:00:00	\N	VND	2026-06-29 00:00:00
40	57	2	expired	failed	2026-06-29	10	2070000	414000	1656000	\N	\N	\N	2026-07-09 01:00:00	\N	VND	2026-06-29 00:00:00
35	57	2	canceled	refunded	2026-06-29	10	2370000	474000	1896000	2026-06-29 20:06:06.608277	2	FGNFG	2026-07-08 08:00:00	\N	VND	2026-06-29 00:00:00
52	58	4	expired	failed	2026-06-30	9	1250000	1766	1248234	\N	\N	\N	2026-07-02 01:00:00	\N	VND	2026-06-30 00:00:00
169	58	81	expired	failed	2026-07-13	28	1890000	189000	1701000	\N	\N	\N	2026-08-12 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
170	59	82	canceled	unpaid	2026-07-12	\N	12180000	0	12180000	2026-07-21 00:15:54.274445	4	Khách thay đổi lịch trình cá nhân	2026-08-13 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
171	60	83	waiting_manual_confirmation	pending	2026-07-11	\N	7670000	0	7670000	\N	\N	\N	2026-08-14 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
172	61	84	confirmed	paid	2026-07-10	28	2890000	289000	2601000	\N	\N	\N	2026-08-15 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
173	62	85	confirmed	paid	2026-07-09	\N	31980000	0	31980000	\N	\N	\N	2026-08-16 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
175	1	72	expired	failed	2026-07-07	28	1290000	129000	1161000	\N	\N	\N	2026-08-18 00:15:54.274445	0901234567	VND	2026-07-22 00:15:54.274445
176	3	73	canceled	unpaid	2026-07-06	\N	1310000	0	1310000	2026-07-21 00:15:54.274445	4	Khách thay đổi lịch trình cá nhân	2026-08-19 00:15:54.274445	0763388151	VND	2026-07-22 00:15:54.274445
177	5	74	waiting_manual_confirmation	pending	2026-07-05	\N	3390000	0	3390000	\N	\N	\N	2026-08-20 00:15:54.274445	0901234567	VND	2026-07-22 00:15:54.274445
54	58	4	canceled	paid	2026-07-01	11	4870000	13951	4856049	2026-07-01 22:43:31.784778	58	thích	2026-07-10 01:00:00	\N	VND	2026-07-01 00:00:00
48	58	6	expired	failed	2026-06-30	\N	600000	0	600000	\N	\N	\N	2026-07-04 02:00:00	\N	VND	2026-06-30 00:00:00
66	57	6	confirmed	paid	2026-07-20	\N	350000	0	350000	\N	\N	\N	2026-07-21 02:00:00	0763388155	VND	2026-07-20 14:00:49.036692
26	57	1	expired	failed	2026-06-29	\N	690000	0	690000	\N	\N	\N	\N	\N	VND	2026-06-29 00:00:00
9	1	1	expired	failed	2026-06-02	5	690000	64	689936	\N	\N	\N	\N	\N	VND	2026-06-02 00:00:00
12	50	4	canceled	unpaid	2026-06-23	\N	4540000	0	4540000	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
27	57	1	canceled	unpaid	2026-06-29	\N	690000	0	690000	2026-06-29 16:00:59.556684	57	I changed my travel plan	2026-07-15 08:00:00	\N	VND	2026-06-29 00:00:00
49	58	6	confirmed	paid	2026-06-30	11	350000	3000	347000	\N	\N	\N	2026-07-01 02:00:00	\N	VND	2026-06-30 00:00:00
24	51	4	confirmed	paid	2026-06-27	\N	1250000	0	1250000	\N	\N	\N	\N	\N	VND	2026-06-27 00:00:00
19	51	6	confirmed	paid	2026-06-24	\N	350000	0	350000	\N	\N	\N	\N	\N	VND	2026-06-24 00:00:00
71	55	6	expired	failed	2026-07-21	\N	350000	0	350000	\N	\N	\N	2026-07-21 09:00:00	0942375895	VND	2026-07-21 01:34:55.762299
67	55	6	confirmed	paid	2026-07-20	\N	350000	0	350000	\N	\N	\N	2026-07-21 09:00:00	0826799459	VND	2026-07-20 14:04:49.636184
1	2	1	expired	unpaid	2026-06-01	5	690000	0	690000	\N	\N	\N	\N	\N	VND	2026-06-01 00:00:00
70	58	6	cancel_pending	paid	2026-07-21	9	700000	3000	697000	\N	\N	\N	2026-07-25 09:00:00	0333622144	VND	2026-07-21 01:32:13.597843
57	58	2	canceled	paid	2026-07-01	11	5930000	1186000	4744000	2026-07-01 23:12:47.160497	58	Cancel BK-57. Paid bookings will create a manual refund request for staff to process.	2026-08-07 01:00:00	\N	VND	2026-07-01 00:00:00
28	57	1	expired	failed	2026-06-29	\N	690000	0	690000	\N	\N	\N	2026-06-30 08:00:00	\N	VND	2026-06-29 00:00:00
51	58	4	expired	failed	2026-06-30	\N	1250000	0	1250000	\N	\N	\N	2026-07-04 01:00:00	\N	VND	2026-06-30 00:00:00
41	57	6	canceled	refunded	2026-06-29	\N	350000	0	350000	2026-06-29 21:29:34.968365	2	Cancel BK-41. Paid bookings will create a manual refund request for staff to process.	2026-07-02 02:00:00	\N	VND	2026-06-29 00:00:00
62	55	6	confirmed	paid	2026-07-02	11	350000	3000	347000	\N	\N	\N	2026-07-02 02:00:00	\N	VND	2026-07-02 00:00:00
72	58	6	confirmed	paid	2026-07-21	9	700000	3000	697000	\N	\N	\N	2026-07-25 09:00:00	0333622144	VND	2026-07-21 01:38:34.660488
15	50	4	expired	unpaid	2026-06-23	\N	5000000	0	5000000	\N	\N	\N	\N	\N	VND	2026-06-23 00:00:00
46	58	6	expired	failed	2026-06-30	\N	850000	0	850000	\N	\N	\N	2026-07-11 02:00:00	\N	VND	2026-06-30 00:00:00
32	57	6	canceled	refunded	2026-06-29	\N	350000	0	350000	2026-06-29 18:37:57.279972	57	bị bệnh	2026-07-01 15:00:00	\N	VND	2026-06-29 00:00:00
8	1	1	confirmed	paid	2026-06-02	5	690000	1050	688950	\N	\N	\N	\N	\N	VND	2026-06-02 00:00:00
25	51	2	confirmed	paid	2026-06-29	10	890000	178000	712000	\N	\N	\N	\N	\N	VND	2026-06-29 00:00:00
44	58	6	expired	failed	2026-06-29	\N	600000	0	600000	\N	\N	\N	2026-07-12 02:00:00	\N	VND	2026-06-29 00:00:00
178	10	75	confirmed	paid	2026-07-04	28	4690000	300000	4390000	\N	\N	\N	2026-08-21 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
179	11	76	confirmed	paid	2026-07-03	\N	1640000	0	1640000	\N	\N	\N	2026-08-22 00:15:54.274445	0901234567	VND	2026-07-22 00:15:54.274445
181	55	78	expired	failed	2026-07-01	28	890000	89000	801000	\N	\N	\N	2026-08-24 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
182	56	79	canceled	unpaid	2026-06-30	\N	1440000	0	1440000	2026-07-21 00:15:54.274445	4	Khách thay đổi lịch trình cá nhân	2026-08-25 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
183	57	80	waiting_manual_confirmation	pending	2026-06-29	\N	3770000	0	3770000	\N	\N	\N	2026-08-26 00:15:54.274445	0763388155	VND	2026-07-22 00:15:54.274445
184	58	81	confirmed	paid	2026-06-28	28	1890000	189000	1701000	\N	\N	\N	2026-08-27 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
185	59	82	confirmed	paid	2026-06-27	\N	12180000	0	12180000	\N	\N	\N	2026-08-28 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
187	61	84	expired	failed	2026-06-25	28	2890000	289000	2601000	\N	\N	\N	2026-08-30 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
188	62	85	canceled	unpaid	2026-06-24	\N	31980000	0	31980000	2026-07-21 00:15:54.274445	4	Khách thay đổi lịch trình cá nhân	2026-08-31 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
189	63	86	waiting_manual_confirmation	pending	2026-06-23	\N	92700000	0	92700000	\N	\N	\N	2026-09-01 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
162	5	74	expired	unpaid	2026-07-20	\N	3390000	0	3390000	\N	\N	\N	2026-08-05 00:15:54.274445	0901234567	VND	2026-07-22 00:15:54.274445
180	50	77	expired	unpaid	2026-07-02	\N	8370000	0	8370000	\N	\N	\N	2026-08-23 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
168	57	80	expired	unpaid	2026-07-14	\N	3770000	0	3770000	\N	\N	\N	2026-08-11 00:15:54.274445	0763388155	VND	2026-07-22 00:15:54.274445
186	60	83	expired	unpaid	2026-06-26	\N	7670000	0	7670000	\N	\N	\N	2026-08-29 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
174	63	86	expired	unpaid	2026-07-08	\N	92700000	0	92700000	\N	\N	\N	2026-08-17 00:15:54.274445	0900000000	VND	2026-07-22 00:15:54.274445
\.


--
-- Data for Name: booking_detail; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.booking_detail (booking_detail_id, booking_id, passenger_name, age_category, price, seat_number, special_request) FROM stdin;
175	90	Nguyễn Văn Hoài	adult	1690000	CT1-1	Suất ăn chay
176	90	Nguyễn Văn Hoài – thành viên 2	child	1090000	CT1-2	\N
177	91	Nguyễn Văn An	adult	650000	CT2-1	\N
178	92	Nguyễn Văn Hoài	adult	890000	CT3-1	\N
179	92	Nguyễn Văn Hoài – thành viên 2	child	590000	CT3-2	\N
180	93	Đoàn Thị Yến Nhi	adult	4290000	CT4-1	\N
181	94	Đặng Khoa	adult	590000	CT5-1	\N
182	94	Đặng Khoa – thành viên 2	child	390000	CT5-2	\N
183	95	Nguyễn Văn Hoài	adult	1290000	CT6-1	\N
184	96	Nguyễn Văn An	adult	890000	CT7-1	\N
185	96	Nguyễn Văn An – thành viên 2	child	590000	CT7-2	\N
186	96	Nguyễn Văn An – thành viên 3	child	590000	CT7-3	\N
187	97	Nguyễn Văn Hoài	adult	1690000	CT8-1	\N
188	98	Đoàn Thị Yến Nhi	adult	650000	CT9-1	\N
189	98	Đoàn Thị Yến Nhi – thành viên 2	child	420000	CT9-2	\N
190	99	Đặng Khoa	adult	4290000	CT10-1	\N
191	99	Đặng Khoa – thành viên 2	child	2890000	CT10-2	\N
312	160	Nguyễn Văn Hoài	adult	1290000	VN01-1	Suất ăn chay
313	161	Nguyễn Văn An	adult	790000	VN02-1	\N
314	161	Nguyễn Văn An – thành viên 2	child	520000	VN02-2	\N
315	162	Nguyễn Văn Hoài	adult	1490000	VN03-1	\N
316	162	Nguyễn Văn Hoài – thành viên 2	child	950000	VN03-2	\N
317	162	Nguyễn Văn Hoài – thành viên 3	child	950000	VN03-3	\N
318	163	Đoàn Thị Yến Nhi	adult	4690000	VN04-1	\N
319	164	Đặng Khoa	adult	990000	VN05-1	\N
320	164	Đặng Khoa – thành viên 2	child	650000	VN05-2	\N
321	165	Đoàn Nhi	adult	3590000	VN06-1	\N
322	165	Đoàn Nhi – thành viên 2	child	2390000	VN06-2	\N
323	165	Đoàn Nhi – thành viên 3	child	2390000	VN06-3	\N
324	166	Lê Đăng Khoa	adult	890000	VN07-1	\N
325	167	Lê Thịnh	adult	850000	VN08-1	\N
326	167	Lê Thịnh – thành viên 2	child	590000	VN08-2	\N
327	168	Nguyễn Chí Dương	adult	1590000	VN09-1	\N
328	168	Nguyễn Chí Dương – thành viên 2	child	1090000	VN09-2	\N
329	168	Nguyễn Chí Dương – thành viên 3	child	1090000	VN09-3	\N
330	169	Phạm Văn Hoài	adult	1890000	VN10-1	\N
331	170	Lê Thịnh	adult	7290000	VN11-1	Suất ăn chay
332	170	Lê Thịnh – thành viên 2	child	4890000	VN11-2	\N
333	171	Phạm Văn Hoài	adult	3290000	VN12-1	\N
334	171	Phạm Văn Hoài – thành viên 2	child	2190000	VN12-2	\N
335	171	Phạm Văn Hoài – thành viên 3	child	2190000	VN12-3	\N
336	172	Đăng Khoa Lê	adult	2890000	VN13-1	\N
337	173	Nguyễn Thị Ngọc Hoa	adult	18990000	VN14-1	\N
338	173	Nguyễn Thị Ngọc Hoa – thành viên 2	child	12990000	VN14-2	\N
339	174	Phạm Văn Hoài	adult	38900000	VN15-1	\N
340	174	Phạm Văn Hoài – thành viên 2	child	26900000	VN15-2	\N
341	174	Phạm Văn Hoài – thành viên 3	child	26900000	VN15-3	\N
342	175	Nguyễn Văn Hoài	adult	1290000	VN16-1	\N
343	176	Nguyễn Văn An	adult	790000	VN17-1	\N
344	176	Nguyễn Văn An – thành viên 2	child	520000	VN17-2	\N
345	177	Nguyễn Văn Hoài	adult	1490000	VN18-1	\N
346	177	Nguyễn Văn Hoài – thành viên 2	child	950000	VN18-2	\N
347	177	Nguyễn Văn Hoài – thành viên 3	child	950000	VN18-3	\N
348	178	Đoàn Thị Yến Nhi	adult	4690000	VN19-1	\N
349	179	Đặng Khoa	adult	990000	VN20-1	\N
350	179	Đặng Khoa – thành viên 2	child	650000	VN20-2	\N
351	180	Đoàn Nhi	adult	3590000	VN21-1	Suất ăn chay
352	180	Đoàn Nhi – thành viên 2	child	2390000	VN21-2	\N
353	180	Đoàn Nhi – thành viên 3	child	2390000	VN21-3	\N
354	181	Lê Đăng Khoa	adult	890000	VN22-1	\N
355	182	Lê Thịnh	adult	850000	VN23-1	\N
356	182	Lê Thịnh – thành viên 2	child	590000	VN23-2	\N
357	183	Nguyễn Chí Dương	adult	1590000	VN24-1	\N
358	183	Nguyễn Chí Dương – thành viên 2	child	1090000	VN24-2	\N
359	183	Nguyễn Chí Dương – thành viên 3	child	1090000	VN24-3	\N
360	184	Phạm Văn Hoài	adult	1890000	VN25-1	\N
361	185	Lê Thịnh	adult	7290000	VN26-1	\N
362	185	Lê Thịnh – thành viên 2	child	4890000	VN26-2	\N
363	186	Phạm Văn Hoài	adult	3290000	VN27-1	\N
364	186	Phạm Văn Hoài – thành viên 2	child	2190000	VN27-2	\N
365	186	Phạm Văn Hoài – thành viên 3	child	2190000	VN27-3	\N
366	187	Đăng Khoa Lê	adult	2890000	VN28-1	\N
367	188	Nguyễn Thị Ngọc Hoa	adult	18990000	VN29-1	\N
368	188	Nguyễn Thị Ngọc Hoa – thành viên 2	child	12990000	VN29-2	\N
369	189	Phạm Văn Hoài	adult	38900000	VN30-1	\N
370	189	Phạm Văn Hoài – thành viên 2	child	26900000	VN30-2	\N
371	189	Phạm Văn Hoài – thành viên 3	child	26900000	VN30-3	\N
1	1	Nguyen Van A	adult	690000	string	string
3	7	Nguyen Van 10	adult	690000	string	string
4	8	Nguyen Van Du	adult	690000	string	string
5	9	Nguyen Van A	adult	690000	string	string
6	10	Nguyen Van A	adult	690000	string	string
7	11	Đoàn Thị Yến Nhi	adult	1250000	\N	Preferred arrival time: 2026-06-26T03:35
8	11	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
9	11	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
10	11	Đoàn Thị Yến Nhi	child	790000	\N	\N
11	12	Đoàn Thị Yến Nhi	adult	1250000	\N	Preferred arrival time: 2026-06-26T10:20
12	12	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
13	12	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
14	12	Đoàn Thị Yến Nhi	child	790000	\N	\N
15	13	Đoàn Thị Yến Nhi	adult	1250000	\N	Preferred arrival time: 2026-06-30T04:42
16	13	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
17	13	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
18	13	Đoàn Thị Yến Nhi	child	790000	\N	\N
19	14	Đoàn Thị Yến Nhi	adult	1250000	\N	Preferred arrival time: 2026-06-27T04:43
20	14	Đoàn Thị Yến Nhi	adult	1250000	\N	\N
21	15	Doan Thi Yen Nhi	adult	1250000	\N	Preferred arrival time: 2026-06-30T05:09 | Phone: 0794910788
22	15	Doan Thi Yen Nhi	adult	1250000	\N	\N
23	15	Doan Thi Yen Nhi	adult	1250000	\N	\N
24	15	Doan Thi Yen Nhi	adult	1250000	\N	\N
98	48	treu	child	250000	\N	\N
99	49	ewtưêt	adult	350000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 4235325
100	50	ửywryw	adult	350000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 6426426
101	50	ửywryw	child	250000	\N	\N
102	51	EWTEWET	adult	1250000	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 352353523
103	52	346346	adult	1250000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 43Y43Y34Y
104	53	2523523	adult	1250000	\N	Travel date: 2026-07-11 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 324623532
105	53	2523523	child	790000	\N	\N
106	53	2523523	infant	0	\N	\N
107	54	HOÀI ĐẸP TRAI	adult	1250000	\N	Travel date: 2026-07-10 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0333622144
108	54	HOÀI ĐẸP TRAI	adult	1250000	\N	\N
109	54	HOÀI ĐẸP TRAI	child	790000	\N	\N
110	54	HOÀI ĐẸP TRAI	child	790000	\N	\N
111	54	HOÀI ĐẸP TRAI	child	790000	\N	\N
112	54	HOÀI ĐẸP TRAI	infant	0	\N	\N
113	55	3643643	adult	690000	\N	Travel date: 2026-07-30 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 7457457
114	55	3643643	adult	690000	\N	\N
115	55	3643643	child	450000	\N	\N
25	16	Lê Thịnh	adult	890000	\N	Preferred arrival time: 2026-06-25T13:40 | Phone: 0912345678
26	17	Doan Thi Yen Nhi	adult	890000	\N	Preferred arrival time: 2026-06-30T14:27 | Phone: 0978945612
27	17	Doan Thi Yen Nhi	adult	890000	\N	\N
28	18	fsdfds	adult	350000	\N	Preferred arrival time: 2026-06-26T01:44 | Phone: 09090933333
29	19	tr366	adult	350000	\N	Preferred arrival time: 2026-07-04T01:46 | Phone: 4636
30	20	reyey	adult	890000	\N	Preferred arrival time: 2026-06-24T01:54 | Phone: 547547e
31	21	rỷy	adult	1250000	\N	Preferred arrival time: 2026-06-26T01:56 | Phone: 547547e
32	22	EREỶT	adult	350000	\N	Travel date: 2026-06-28 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 37436346
33	23	Hoài Đẹp Trai	adult	350000	\N	Travel date: 2026-06-28 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0333622144
34	24	Hoài Đẹp Trai	adult	1250000	\N	Travel date: 2026-07-10 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0333622144
35	25	HHH	adult	890000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 12345678
36	26	Test Customer Cancel	adult	690000	A1	Test cancel booking
37	27	Test Customer Cancel	adult	690000	A1	Test cancel booking
38	28	Test Under 24h	adult	690000	\N	\N
40	30	Dương	adult	890000	123	Travel date: 2026-07-01 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155 | 123
41	31	sdf	adult	350000	xcvb	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | dfg
42	32	sdfghdsfgh	adult	350000	dfdg	Travel date: 2026-06-30 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | dfdg
44	34	hgf	adult	350000	sfdgfnh	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | dgv
45	35	OIPOIOPI	adult	890000	\N	Travel date: 2026-07-08 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155
46	35	OIPOIOPI	child	590000	\N	\N
47	35	OIPOIOPI	adult	890000	\N	\N
48	35	OIPOIOPI	infant	0	\N	\N
49	36	sd jcj s	adult	350000	nck	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | sm c
50	37	tfgfg	adult	350000	rhr	Travel date: 2026-07-01 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155 | etgrt
51	38	dsg	adult	350000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155
52	38	dsg	adult	350000	\N	\N
53	38	dsg	adult	350000	\N	\N
54	38	dsg	child	250000	\N	\N
55	38	dsg	child	250000	\N	\N
56	38	dsg	child	250000	\N	\N
57	38	dsg	infant	0	\N	\N
58	39	DSG	adult	350000	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155
59	39	DSG	adult	350000	\N	\N
60	39	DSG	child	250000	\N	\N
61	39	DSG	child	250000	\N	\N
62	39	DSG	infant	0	\N	\N
63	39	DSG	infant	0	\N	\N
64	39	DSG	infant	0	\N	\N
65	39	DSG	infant	0	\N	\N
66	39	DSG	child	250000	\N	\N
67	39	DSG	child	250000	\N	\N
68	39	DSG	child	250000	\N	\N
69	39	DSG	child	250000	\N	\N
70	39	DSG	child	250000	\N	\N
71	39	DSG	child	250000	\N	\N
72	39	DSG	child	250000	\N	\N
73	39	DSG	child	250000	\N	\N
74	39	DSG	child	250000	\N	\N
75	39	DSG	child	250000	\N	\N
76	40	SFA	adult	890000	\N	Travel date: 2026-07-09 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155
77	40	SFA	child	590000	\N	\N
78	40	SFA	child	590000	\N	\N
79	40	SFA	infant	0	\N	\N
80	40	SFA	infant	0	\N	\N
81	40	SFA	infant	0	\N	\N
82	40	SFA	infant	0	\N	\N
83	41	XCFB	adult	350000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 0763388155
84	42	XCBNXCVN	adult	1250000	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 0763388155
85	43	reỷey	adult	350000	\N	Travel date: 2026-07-05 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 436346
86	43	reỷey	child	250000	\N	\N
87	44	cxb	adult	350000	\N	Travel date: 2026-07-12 | Tour schedule: 1 day 09:00 - 17:00 | Phone: xcb
88	44	cxb	child	250000	\N	\N
89	45	DFHEỶ	adult	350000	\N	Travel date: 2026-07-02 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 648486
90	45	DFHEỶ	child	250000	\N	\N
91	46	XVCCB	adult	350000	\N	Travel date: 2026-07-11 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 436346
92	46	XVCCB	child	250000	\N	\N
93	46	XVCCB	child	250000	\N	\N
94	47	54	adult	1250000	\N	Travel date: 2026-07-01 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 534
95	47	54	infant	0	\N	\N
96	47	54	child	790000	\N	\N
97	48	treu	adult	350000	\N	Travel date: 2026-07-04 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 457
116	56	REWY	adult	1250000	\N	Travel date: 2026-07-22 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 346432
117	57	2345	adult	890000	\N	Travel date: 2026-08-07 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 264265
118	57	2345	adult	890000	\N	\N
119	57	2345	adult	890000	\N	\N
120	57	2345	adult	890000	\N	\N
121	57	2345	adult	890000	\N	\N
122	57	2345	adult	890000	\N	\N
123	57	2345	child	590000	\N	\N
124	58	4363	adult	350000	\N	Travel date: 2026-07-15 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 4363463
125	59	ẺYEỶE	adult	690000	\N	Travel date: 2026-07-30 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 457754
126	59	ẺYEỶE	adult	690000	\N	\N
127	59	ẺYEỶE	child	450000	\N	\N
128	59	ẺYEỶE	infant	0	\N	\N
129	60	erỷỷ	adult	890000	\N	Travel date: 2026-07-14 | Tour schedule: 1 day 08:00 - 17:00 | Phone: 75474
130	60	erỷỷ	adult	890000	\N	\N
131	60	erỷỷ	child	590000	\N	\N
132	61	Hoài	adult	890000	sdfdg	sdfd\nContact phone: 0906901402
133	62	32	adult	350000	\N	Travel date: 2026-07-03 | Tour schedule: 1 day 09:00 - 17:00 | Phone: 32R523
134	63	Phạm Văn Hoài	adult	350000	\N	\N
135	63	Phạm Văn Hoài	child	250000	\N	\N
136	63	Phạm Văn Hoài	adult	350000	\N	\N
137	64	hoai pham	adult	350000	\N	\N
138	65	chi duong	adult	350000	\N	\N
139	66	Nguyễn Chí Dương	adult	350000	ad	dsf
140	67	Le Dang Khoa	adult	350000	\N	\N
141	67	Le Dang Khoa	infant	0	\N	\N
142	68	HOAI D	adult	350000	\N	\N
143	69	hoài phạm	adult	350000	\N	\N
144	69	hoài phạm	adult	350000	\N	\N
145	70	h p	adult	350000	\N	\N
146	70	h p	adult	350000	\N	\N
147	71	Le Dang Khoa	adult	350000	\N	\N
148	72	ja s	adult	350000	\N	\N
149	72	ja s	adult	350000	\N	\N
150	73	Phạm Văn Hoài	adult	350000	\N	\N
151	73	Phạm Văn Hoài	adult	350000	\N	\N
152	74	Phạm Văn Hoài	adult	350000	\N	\N
153	74	Phạm Văn Hoài	adult	350000	\N	\N
\.


--
-- Data for Name: booking_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.booking_status_history (booking_status_history_id, booking_id, action, from_status, to_status, from_payment_status, to_payment_status, reason, changed_by, metadata, created_at) FROM stdin;
1	20	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-29 15:22:01.697084
2	13	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.599282
3	14	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.710399
4	15	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.816532
5	16	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-06-29 15:30:01.923542
6	26	booking_created	\N	pending	\N	unpaid	\N	57	{"final_amount": "250000", "passenger_count": 1}	2026-06-29 15:35:37.718564
7	27	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-15T01:00:00.000Z", "final_amount": "250000", "passenger_count": 1}	2026-06-29 16:00:24.548796
8	27	booking_canceled	pending	canceled	unpaid	unpaid	I changed my travel plan	57	{"expired_pending_payments": 0}	2026-06-29 16:00:59.556684
9	28	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-06-30T01:00:00.000Z", "final_amount": "250000", "passenger_count": 1}	2026-06-29 16:02:01.717687
11	30	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-29 16:09:01.206972
12	31	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 17:01:09.8141
13	31	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 15, "sepay_transaction_id": "65648744"}	2026-06-29 17:01:35.896574
14	31	booking_canceled_refund_pending	confirmed	canceled	paid	paid	\N	57	{"payment_id": 15, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 1}	2026-06-29 17:02:49.832827
15	31	manual_refund_approved	canceled	canceled	paid	paid	đã hoàn tiền	2	{"payment_id": 15, "refund_amount": "3000.00", "refund_request_id": 1}	2026-06-29 18:02:51.497917
16	31	manual_refund_completed	canceled	canceled	paid	refunded	lkjhg	2	{"payment_id": 15, "refund_amount": "3000.00", "transaction_code": null, "refund_request_id": 1}	2026-06-29 18:04:38.898635
17	32	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 18:10:41.475111
18	32	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 16, "sepay_transaction_id": "65662559"}	2026-06-29 18:11:10.924087
19	32	booking_canceled_refund_pending	confirmed	canceled	paid	paid	bị bệnh	57	{"payment_id": 16, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 2}	2026-06-29 18:37:57.279972
20	32	manual_refund_approved	canceled	canceled	paid	paid	duyệt	2	{"payment_id": 16, "refund_amount": "3000.00", "refund_request_id": 2}	2026-06-29 18:39:01.865707
21	32	manual_refund_completed	canceled	canceled	paid	refunded	1485	2	{"payment_id": 16, "refund_amount": "3000.00", "transaction_code": "147852", "refund_request_id": 2}	2026-06-29 18:39:14.872021
26	34	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 18:57:53.119911
27	34	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 18, "sepay_transaction_id": "65670623"}	2026-06-29 18:58:14.586359
28	34	booking_cancel_requested	confirmed	pending	paid	paid	hủy	57	{"payment_id": 18, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 4}	2026-06-29 18:58:44.542474
29	34	manual_refund_rejected	cancel_pending	confirmed	paid	paid	\N	2	{"payment_id": 18, "refund_amount": "3000.00", "refund_request_id": 4}	2026-06-29 19:25:24.005853
30	34	booking_cancel_requested	confirmed	cancel_pending	paid	paid	test	57	{"payment_id": 18, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 5}	2026-06-29 19:25:57.780972
31	34	manual_refund_rejected	cancel_pending	confirmed	paid	paid	\N	2	{"payment_id": 18, "refund_amount": "3000.00", "refund_request_id": 5}	2026-06-29 19:26:18.936126
32	35	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-08T01:00:00.000Z", "final_amount": "10000", "passenger_count": 4}	2026-06-29 19:47:17.945064
33	35	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 19, "sepay_transaction_id": "65678882"}	2026-06-29 19:47:38.576706
34	35	booking_cancel_requested	confirmed	cancel_pending	paid	paid	FGNFG	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 19:48:15.242993
35	35	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	sfh	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 19:58:32.799647
36	35	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	vad	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 19:59:34.198578
37	35	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	tdj	57	{"payment_id": 19, "refund_amount": 10000, "refund_percent": 100, "refund_request_id": 6}	2026-06-29 20:00:18.991515
38	34	booking_cancel_requested	confirmed	cancel_pending	paid	paid	b n	57	{"payment_id": 18, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 7}	2026-06-29 20:05:00.228502
39	35	manual_refund_approved	cancel_pending	canceled	paid	paid	ok	2	{"payment_id": 19, "refund_amount": "10000.00", "refund_request_id": 6}	2026-06-29 20:06:06.608277
40	35	manual_refund_completed	canceled	canceled	paid	refunded	48\n8435	2	{"payment_id": 19, "refund_amount": "10000.00", "transaction_code": "432515", "refund_request_id": 6}	2026-06-29 20:06:48.378527
41	36	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 20:29:13.479997
42	37	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-01T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 20:44:12.491713
43	38	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "0", "passenger_count": 7}	2026-06-29 21:11:26.717996
44	39	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-04T02:00:00.000Z", "final_amount": "540", "passenger_count": 18}	2026-06-29 21:12:59.772568
45	40	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-09T01:00:00.000Z", "final_amount": "750000", "passenger_count": 7}	2026-06-29 21:13:52.008998
46	41	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "3000", "passenger_count": 1}	2026-06-29 21:14:29.132132
47	41	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 25, "sepay_transaction_id": "65692984"}	2026-06-29 21:14:45.601194
48	41	booking_canceled_refund_pending	confirmed	canceled	paid	paid	FDSHH	57	{"payment_id": 25, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 8}	2026-06-29 21:15:27.58863
49	41	manual_refund_rejected	canceled	confirmed	paid	paid	VCN	2	{"payment_id": 25, "refund_amount": "3000.00", "refund_request_id": 8}	2026-06-29 21:28:49.024266
50	41	booking_cancel_requested	confirmed	cancel_pending	paid	paid	Cancel BK-41. Paid bookings will create a manual refund request for staff to process.	57	{"payment_id": 25, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 9}	2026-06-29 21:29:14.379982
51	41	manual_refund_approved	cancel_pending	canceled	paid	paid	Request #9 for booking BK-41.	2	{"payment_id": 25, "refund_amount": "3000.00", "refund_request_id": 9}	2026-06-29 21:29:34.968365
52	41	manual_refund_completed	canceled	canceled	paid	refunded	Request #9 for booking BK-41.	2	{"payment_id": 25, "refund_amount": "3000.00", "transaction_code": "Request #9 for booking BK-41.", "refund_request_id": 9}	2026-06-29 21:30:03.149202
53	42	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-04T01:00:00.000Z", "final_amount": "3532", "passenger_count": 1}	2026-06-29 21:30:31.852911
54	43	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-05T02:00:00.000Z", "final_amount": "6000", "passenger_count": 2}	2026-06-29 23:08:04.213186
55	43	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 27, "sepay_transaction_id": "65707025"}	2026-06-29 23:10:08.328083
56	44	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-12T02:00:00.000Z", "final_amount": "6000", "passenger_count": 2}	2026-06-29 23:14:16.323371
57	45	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-02T02:00:00.000Z", "final_amount": "2475", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-06-30 00:14:25.958843
58	45	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 29, "sepay_transaction_id": "65713026"}	2026-06-30 00:16:07.849359
59	46	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-11T02:00:00.000Z", "final_amount": "6900", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-06-30 00:17:33.088675
60	39	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
61	46	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
62	40	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
63	37	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
64	38	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
65	42	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
66	36	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
67	44	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:37:31.031646
68	26	booking_auto_expired	pending	expired	unpaid	failed	Unpaid booking expired automatically	\N	{}	2026-06-30 00:37:59.275107
69	28	booking_auto_expired	pending	expired	unpaid	failed	Unpaid booking expired automatically	\N	{}	2026-06-30 00:37:59.275107
70	47	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-06-30T18:00:00.000Z", "final_amount": "5828", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-06-30 00:41:13.679376
71	47	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 00:56:44.025246
72	48	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-03T19:00:00.000Z", "final_amount": "4950", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-06-30 00:58:05.655638
73	48	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 01:02:15.468519
74	49	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-06-30T19:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 1, "payment_required": false}	2026-06-30 16:12:18.443459
75	50	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-06-30T19:00:00.000Z", "final_amount": "4950", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-06-30 16:13:10.298757
76	50	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 33, "sepay_transaction_id": "65804297"}	2026-06-30 16:15:50.336273
77	51	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-03T18:00:00.000Z", "final_amount": "3532", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-06-30 16:21:53.072563
78	52	booking_created	\N	waiting_manual_confirmation	\N	unpaid	\N	58	{"departure_at": "2026-07-01T18:00:00.000Z", "final_amount": "1766", "payment_method": "manual", "passenger_count": 1, "payment_required": true}	2026-06-30 16:22:28.760717
79	53	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-10T18:00:00.000Z", "final_amount": "2914", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-06-30 16:23:44.141258
80	53	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 35, "sepay_transaction_id": "65805714"}	2026-06-30 16:24:15.188828
81	51	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-06-30 16:37:12.38838
82	52	manual_confirmation_auto_expired	waiting_manual_confirmation	expired	unpaid	failed	Manual payment confirmation window expired	\N	{}	2026-07-01 01:38:57.004519
83	54	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-09T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 6, "payment_required": false}	2026-07-01 22:39:08.768653
84	54	booking_canceled	confirmed	canceled	paid	paid	thích	58	{"expired_pending_payments": 0}	2026-07-01 22:43:31.784778
85	53	booking_cancel_requested	confirmed	cancel_pending	paid	paid	test	58	{"payment_id": 35, "refund_amount": 2914, "refund_percent": 100, "refund_request_id": 10}	2026-07-01 22:45:03.05234
86	53	manual_refund_rejected	cancel_pending	confirmed	paid	paid	sdgsdg	51	{"payment_id": 35, "refund_amount": "2914.00", "refund_request_id": 10}	2026-07-01 22:46:00.983694
87	55	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-29T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 3, "payment_required": false}	2026-07-01 22:59:53.480438
88	56	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-21T18:00:00.000Z", "final_amount": "3532", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-01 23:01:03.604904
89	56	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 36, "sepay_transaction_id": "66040243"}	2026-07-01 23:01:27.063091
90	57	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-08-06T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 7, "payment_required": false}	2026-07-01 23:10:23.528333
91	57	booking_canceled	confirmed	canceled	paid	paid	Cancel BK-57. Paid bookings will create a manual refund request for staff to process.	58	{"expired_pending_payments": 0}	2026-07-01 23:12:47.160497
92	58	booking_created	\N	waiting_manual_confirmation	\N	unpaid	\N	58	{"departure_at": "2026-07-14T19:00:00.000Z", "final_amount": "1500", "payment_method": "manual", "passenger_count": 1, "payment_required": true}	2026-07-01 23:14:09.431833
93	59	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-29T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 4, "payment_required": false}	2026-07-01 23:19:35.489531
94	60	booking_created	\N	confirmed	\N	paid	\N	58	{"departure_at": "2026-07-13T18:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 3, "payment_required": false}	2026-07-01 23:26:27.200194
95	58	manual_confirmation_auto_expired	waiting_manual_confirmation	expired	unpaid	failed	Manual payment confirmation window expired	\N	{}	2026-07-02 00:01:00.48519
96	61	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-04T01:00:00.000Z", "final_amount": "2500", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-02 14:41:40.970968
97	56	booking_cancel_requested	confirmed	cancel_pending	paid	paid	nghèo hết tiền	58	{"payment_id": 36, "refund_amount": 3532, "refund_percent": 100, "refund_request_id": 11}	2026-07-02 14:51:50.042985
98	56	manual_refund_approved	cancel_pending	canceled	paid	paid	Approve Refund Request	2	{"payment_id": 36, "refund_amount": "3532.00", "refund_request_id": 11}	2026-07-02 14:53:43.9381
99	61	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-07-02 15:27:02.234886
100	62	booking_created	\N	confirmed	\N	paid	\N	55	{"departure_at": "2026-07-02T19:00:00.000Z", "final_amount": "0", "payment_method": "free", "passenger_count": 1, "payment_required": false}	2026-07-02 23:09:14.762649
101	63	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-30T02:00:00.000Z", "final_amount": "3975", "payment_method": "bank_transfer", "passenger_count": 3, "payment_required": true}	2026-07-19 22:24:01.622641
102	63	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 38, "sepay_transaction_id": "69024120"}	2026-07-19 22:28:46.491227
103	64	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-22T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 03:17:35.005451
104	65	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 13:46:43.747006
105	65	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 39, "sepay_transaction_id": "69097948"}	2026-07-20 13:47:08.160023
106	65	booking_cancel_requested	confirmed	cancel_pending	paid	paid	không đi nữa	57	{"payment_id": 39, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 12}	2026-07-20 13:49:35.636253
107	65	manual_refund_rejected	cancel_pending	confirmed	paid	paid	...	4	{"payment_id": 39, "refund_amount": "3000.00", "refund_request_id": 12}	2026-07-20 13:50:23.376877
108	65	booking_cancel_requested	confirmed	cancel_pending	paid	paid	sdfg	57	{"payment_id": 39, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 13}	2026-07-20 13:50:56.711069
109	65	manual_refund_approved	cancel_pending	canceled	paid	paid	oke	4	{"payment_id": 39, "refund_amount": "3000.00", "refund_request_id": 13}	2026-07-20 13:51:17.844299
110	65	manual_refund_completed	canceled	canceled	paid	refunded	qưerty	4	{"payment_id": 39, "refund_amount": "3000.00", "transaction_code": "123456", "refund_request_id": 13}	2026-07-20 13:51:48.315447
111	66	booking_created	\N	pending	\N	unpaid	\N	57	{"departure_at": "2026-07-20T19:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 14:00:49.036692
112	66	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 40, "sepay_transaction_id": "69099778"}	2026-07-20 14:01:34.272577
113	67	booking_created	\N	pending	\N	unpaid	\N	55	{"departure_at": "2026-07-21T02:00:00.000Z", "final_amount": "2000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-20 14:04:49.636184
114	67	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 41, "sepay_transaction_id": "69100292"}	2026-07-20 14:05:38.67893
115	68	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-23T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-20 16:22:37.700138
116	68	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 42, "sepay_transaction_id": "69120531"}	2026-07-20 16:23:10.337519
117	69	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-24T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 01:26:33.332753
118	70	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 01:32:13.597843
119	70	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 43, "sepay_transaction_id": "69198764"}	2026-07-21 01:33:01.161866
120	71	booking_created	\N	pending	\N	unpaid	\N	55	{"departure_at": "2026-07-21T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 1, "payment_required": true}	2026-07-21 01:34:55.762299
121	72	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 01:38:34.660488
122	72	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 45, "sepay_transaction_id": "69198929"}	2026-07-21 01:39:03.75847
123	71	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-07-21 01:50:44.164436
124	64	booking_auto_expired	pending	expired	unpaid	failed	Unpaid booking expired automatically	\N	{}	2026-07-21 02:31:19.332881
125	73	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-25T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 15:41:18.080933
126	73	payment_auto_expired	pending	expired	unpaid	failed	Pending payment expired automatically	\N	{}	2026-07-21 15:57:56.564368
127	70	booking_cancel_requested	confirmed	cancel_pending	paid	paid	\N	58	{"payment_id": 43, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 14}	2026-07-21 15:58:11.016816
128	70	booking_cancel_requested	cancel_pending	cancel_pending	paid	paid	\N	58	{"payment_id": 43, "refund_amount": 3000, "refund_percent": 100, "refund_request_id": 14}	2026-07-21 15:58:16.714632
129	74	booking_created	\N	pending	\N	unpaid	\N	58	{"departure_at": "2026-07-22T02:00:00.000Z", "final_amount": "3000", "payment_method": "bank_transfer", "passenger_count": 2, "payment_required": true}	2026-07-21 16:10:34.02564
130	74	payment_paid	pending	confirmed	unpaid	paid	\N	\N	{"source": "sepay_webhook", "payment_id": 47, "sepay_transaction_id": "69283270"}	2026-07-21 16:11:58.755153
131	69	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:14:54.694772
132	92	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:14:54.809682
133	162	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:29:55.357149
134	180	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:29:55.477225
135	168	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:29:55.608134
136	186	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:29:55.716141
137	174	booking_auto_expired	pending	expired	unpaid	unpaid	Pending booking expired automatically	\N	{}	2026-07-22 00:29:55.824115
\.


--
-- Data for Name: coupon; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupon (coupon_id, code, name, description, discount_type, discount_value, max_discount_amount, min_order_amount, usage_limit, used_count, start_date, end_date, status, created_by, created_at, updated_at, deleted_at, archived_at) FROM stdin;
8	SUMMER40	Summer Discount	40% discount for summer tours	percentage	40	100000	500000	100	0	2026-06-01	2026-06-30	active	2	2026-06-20 14:21:17.851534	2026-06-20 14:21:17.851534	\N	\N
3	TEST1780281209397	Temporary Coupon Test	soft deleted after smoke test	percentage	10	50000	100000	6	0	2026-06-01	2026-06-30	inactive	9	2026-06-01 02:33:25.701876	2026-06-01 02:33:26.203888	\N	\N
5	SUMMER30	Summer Discount Updated	string	percentage	15	5000	0	150	2	2026-06-01	2026-07-07	inactive	2	2026-06-01 02:36:55.1853	2026-06-20 13:44:06.609363	\N	\N
1	SUMMER20	Summer Discount	20% discount for summer tours	percentage	20	100000	500000	100	0	2026-06-01	2026-06-30	archived	2	2026-05-30 13:58:46.352903	2026-06-24 07:43:53.457955	\N	2026-06-24 07:43:53.457955
10	SALE99	GIẢM 99%		percentage	99	1000000	4000	10	2	2026-06-25	2026-08-30	active	2	2026-06-29 14:32:49.204433	2026-06-29 19:47:38.576706	\N	\N
28	CHAOMUNG10	Ưu đãi chào mừng	Ưu đãi chào mừng áp dụng theo điều kiện chương trình.	percentage	10	300000	500000	500	0	2026-07-22	2027-01-18	active	4	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N
29	GIADINH15	Ưu đãi tour gia đình	Ưu đãi tour gia đình áp dụng theo điều kiện chương trình.	percentage	15	600000	1500000	500	0	2026-07-22	2027-01-18	active	4	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N
30	MUAHE2026	Ưu đãi mùa hè	Ưu đãi mùa hè áp dụng theo điều kiện chương trình.	percentage	12	500000	1000000	500	0	2026-07-22	2027-01-18	active	4	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N
31	DIUNGAY8	Ưu đãi tour trong ngày	Ưu đãi tour trong ngày áp dụng theo điều kiện chương trình.	percentage	8	200000	300000	500	0	2026-07-22	2027-01-18	active	4	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N
11	SALE100	GIẢM 100%		percentage	100	1000000000	1000	10	7	2026-06-25	2026-10-01	active	2	2026-06-29 20:23:16.729489	2026-07-02 23:09:14.762649	\N	\N
9	SALE50	GIẢM 50	TEST	percentage	50	10000000	1	50	6	2026-06-23	2026-07-31	active	2	2026-06-24 07:43:24.015368	2026-07-21 16:11:58.755153	\N	\N
19	MIENTAY15	Ưu đãi khám phá miền Tây	Giảm 15% cho các hành trình tại Cần Thơ.	percentage	15	500000	500000	200	0	2026-07-22	2027-01-18	active	4	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N
\.


--
-- Data for Name: destination_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.destination_category (destination_category_id, name, description, created_at, updated_at) FROM stdin;
1	Lịch sử	Di tích và công trình gắn với những dấu mốc quan trọng của Việt Nam.	2026-05-21 14:07:04.702614	2026-05-21 14:07:04.702614
4	Sinh thái	Điểm đến gần gũi thiên nhiên và hệ sinh thái bản địa.	2026-06-10 14:23:37.68577	2026-06-10 14:23:37.68577
30	Văn hóa	Không gian lưu giữ phong tục, di sản và đời sống cộng đồng.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
31	Tâm linh	Chùa, thiền viện và công trình tín ngưỡng có giá trị kiến trúc.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
32	Giải trí	Tổ hợp vui chơi, công viên và trải nghiệm dành cho mọi lứa tuổi.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
33	Ẩm thực	Chợ, phố ăn uống và không gian trải nghiệm đặc sản địa phương.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
34	Kiến trúc	Công trình nổi bật về phong cách thiết kế và giá trị thẩm mỹ.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
35	Mua sắm	Chợ truyền thống, phố thương mại và điểm mua sắm đặc trưng.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
36	Biển đảo	Bãi biển, đảo và cảnh quan ven biển nổi bật.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
37	Nghệ thuật	Bảo tàng, phòng trưng bày và không gian sáng tạo.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
\.


--
-- Data for Name: email_verification_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_verification_tokens (verification_id, user_id, token_hash, expires_at, used_at, created_at) FROM stdin;
1	4	79251028c2a8a12dc7576842397b1c0973f91375eeb03173c4c74c86cbc21fd1	2026-05-27 13:45:09.18	2026-05-27 06:31:13.665692	2026-05-27 06:30:09.191439
15	49	83a7229dd4f8f8fd51a16293f970e865fec03cdb590b3039be3606fd7245a5ea	2026-06-23 18:34:16.115	\N	2026-06-23 18:19:16.196352
16	50	fc5932c200f3e53944f0a9a317145346a90a68e4ad570f538de07736b108674c	2026-06-23 18:35:10.124	2026-06-23 18:20:37.798384	2026-06-23 18:20:10.202243
17	51	64c9fc5eda14b98683f0e92268d70304aeab73d6a7484e7d0a57fa993213421b	2026-06-23 19:11:17.289	2026-06-23 18:56:55.805323	2026-06-23 18:56:17.380407
20	56	cb4573ba1151aaa938786ab521f7cdc96b8f56b56835ce7ddf0362e021a264c3	2026-06-24 07:15:02.933	2026-06-24 07:00:40.018656	2026-06-24 07:00:03.01784
21	60	42a71fcec1cb4d91c9adff57f15b6ed5444126ede2d2669efd8b50831801fcd9	2026-07-18 22:59:35.825	2026-07-18 22:46:31.455824	2026-07-18 22:44:29.773397
22	63	7fd97c30f92733d676726f3eb715f6733157e8d625fdbf4d4b95ed9ab686df3b	2026-07-20 19:36:39.963	2026-07-21 02:39:03.432108	2026-07-21 02:21:40.05441
23	63	2427573beba4968939c53dfc74b49714fa0168aab66b471d6bd38878f5498916	2026-07-20 19:54:03.528	2026-07-21 02:43:00.616096	2026-07-21 02:39:03.621614
25	63	c51b2b7b3945ade3d2a1ea257893e045d4f28401abfa0d88613c706189c76b27	2026-07-21 03:02:06.835227	2026-07-21 02:47:25.215363	2026-07-21 02:47:06.835227
\.


--
-- Data for Name: group_trip; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_trip (group_trip_id, booking_id, name, visibility, leader_id, created_by, status, created_at, updated_at, description, destination_id, destination_name, start_date, end_date, max_members, deleted_at) FROM stdin;
18	\N	Cùng Khám Phá Chùa Thiên Mụ	private	10	10	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Chùa Thiên Mụ và trải nghiệm ẩm thực địa phương.	71	Chùa Thiên Mụ	2026-08-20	2026-08-22	14	\N
19	\N	Cùng Khám Phá Phố cổ Hội An	public	11	11	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Phố cổ Hội An và trải nghiệm ẩm thực địa phương.	72	Phố cổ Hội An	2026-08-23	2026-08-25	8	\N
20	\N	Cùng Khám Phá Bà Nà Hills	public	50	50	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Bà Nà Hills và trải nghiệm ẩm thực địa phương.	73	Bà Nà Hills	2026-08-26	2026-08-28	10	\N
21	\N	Cùng Khám Phá Chợ Bến Thành	private	55	55	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Chợ Bến Thành và trải nghiệm ẩm thực địa phương.	74	Chợ Bến Thành	2026-08-29	2026-08-31	12	\N
22	\N	Cùng Khám Phá Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh	public	56	56	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh và trải nghiệm ẩm thực địa phương.	75	Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh	2026-09-01	2026-09-03	14	\N
6	\N	Kết Nối Sinh Viên FPT	private	62	57	active	2026-07-20 13:10:35.213544	2026-07-20 15:02:47.820943	Nhóm riêng dành cho sinh viên cùng tham quan và tổ chức hoạt động tại campus.	7	Trường Đại học FPT Cần Thơ	2026-07-22	2026-07-24	10	2026-07-20 15:02:47.820943
7	\N	Một Ngày Ở Campus FPT	public	50	50	active	2026-07-20 16:00:50.461632	2026-07-20 16:01:52.386477	Tham quan các tòa nhà nổi bật và tìm hiểu đời sống sinh viên FPT Cần Thơ.	7	Trường Đại học FPT Cần Thơ	2026-07-21	2026-07-22	10	\N
8	\N	Team Building Miền Tây	private	58	58	archived	2026-07-20 16:29:18.827346	2026-07-21 14:45:57.117709	Lên kế hoạch hoạt động nhóm kết hợp vui chơi sinh thái tại Cần Thơ.	7	Trường Đại học FPT Cần Thơ	2026-07-29	2026-07-31	30	\N
9	\N	Khám Phá FPT Cần Thơ	public	58	58	active	2026-07-21 14:28:27.769924	2026-07-21 14:49:23.649788	Nhóm mở dành cho người muốn tham quan kiến trúc và môi trường học tập tại FPT Cần Thơ.	7	Trường Đại học FPT Cần Thơ	2026-07-25	2026-07-31	30	\N
10	\N	Sài Gòn Lịch Sử	public	60	60	active	2026-07-21 14:38:32.713284	2026-07-21 14:38:32.713284	Cùng tham quan Dinh Độc Lập và các địa danh lịch sử lân cận.	2	Dinh Độc Lập	2026-07-25	2026-07-31	25	\N
11	\N	Campus Tour FPT	public	58	58	active	2026-07-21 16:18:01.644354	2026-07-21 16:20:56.692737	Hẹn nhóm tham quan campus và giao lưu cùng sinh viên FPT Cần Thơ.	7	Trường Đại học FPT Cần Thơ	2026-07-22	2026-07-26	20	\N
1	\N	Khám Phá Dấu Ấn Sài Gòn	public	58	58	active	2026-07-18 15:54:40.287037	2026-07-20 10:59:31.491535	Nhóm cùng tham quan các địa danh lịch sử tiêu biểu tại trung tâm Thành phố Hồ Chí Minh.	3	Bến Nhà Rồng – Bảo tàng Hồ Chí Minh	2026-07-17	2026-07-19	20	\N
2	\N	Cuối Tuần Ở Cần Thơ	private	50	50	active	2026-07-20 02:57:34.974109	2026-07-20 02:57:34.974109	Chuyến đi ngắn ngày khám phá cảnh quan, ẩm thực và nhịp sống Cần Thơ.	7	Trường Đại học FPT Cần Thơ	2026-07-22	2026-07-23	6	\N
4	\N	Hành Trình Bến Nhà Rồng	public	58	58	active	2026-07-20 11:09:52.699401	2026-07-20 11:10:09.335914	Cùng tìm hiểu lịch sử và ngắm cảnh ven sông Sài Gòn.	3	Bến Nhà Rồng – Bảo tàng Hồ Chí Minh	2026-07-20	2026-07-22	12	\N
5	\N	Cần Thơ Xanh	public	55	55	active	2026-07-20 13:05:29.570756	2026-07-20 13:21:39.036689	Nhóm trải nghiệm du lịch sinh thái và ẩm thực miệt vườn Cần Thơ.	6	Làng du lịch sinh thái Ông Đề	2026-07-25	2026-07-26	8	\N
13	\N	Cuối Tuần Khám Phá Cần Thơ	public	1	1	active	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	Cùng khám phá chợ nổi, Bến Ninh Kiều và ẩm thực địa phương.	33	Bến Ninh Kiều	2026-08-11	2026-08-13	10	\N
14	\N	Trải Nghiệm Miệt Vườn Cồn Sơn	public	5	5	active	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	Nhóm nhỏ trải nghiệm vườn cây và làm bánh dân gian tại Cồn Sơn.	37	Cồn Sơn	2026-08-19	2026-08-20	8	\N
15	\N	Cùng Khám Phá Văn Miếu – Quốc Tử Giám	private	1	1	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Văn Miếu – Quốc Tử Giám và trải nghiệm ẩm thực địa phương.	68	Văn Miếu – Quốc Tử Giám	2026-08-11	2026-08-13	8	\N
16	\N	Cùng Khám Phá Hoàng thành Thăng Long	public	3	3	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Hoàng thành Thăng Long và trải nghiệm ẩm thực địa phương.	69	Hoàng thành Thăng Long	2026-08-14	2026-08-16	10	\N
17	\N	Cùng Khám Phá Đại Nội Huế	public	5	5	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	Nhóm nhỏ cùng lên lịch tham quan Đại Nội Huế và trải nghiệm ẩm thực địa phương.	70	Đại Nội Huế	2026-08-17	2026-08-19	12	\N
\.


--
-- Data for Name: group_trip_invite; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_trip_invite (group_trip_invite_id, group_trip_id, invited_user_id, invited_email, invited_by, token_hash, status, expires_at, accepted_at, canceled_at, created_at, declined_at) FROM stdin;
1	1	60	phamvanhoaifpt@gmail.com	58	f8589d7a63644c437512f14dfa68179616e8b62977431c0c6b6dc561df60e489	declined	2026-07-25 22:47:20.623	\N	\N	2026-07-18 22:47:13.928785	2026-07-18 23:08:55.081455
2	1	60	phamvanhoaifpt@gmail.com	58	89372e5eb4ad5c25dc684c51f2ce618d30b0d373d9111ae0d3320e489698942b	canceled	2026-07-25 23:11:07.355	\N	2026-07-18 23:19:19.492179	2026-07-18 23:11:00.68346	\N
3	1	60	phamvanhoaifpt@gmail.com	58	97d4e93c94a5ad03dc7cd9e6a2dc0fed05062d59011846ab403534776f8c1688	accepted	2026-07-25 23:20:05.076	2026-07-18 23:25:23.011992	\N	2026-07-18 23:19:58.401071	\N
4	5	57	duongncce180374@fpt.edu.vn	55	b29551a48c596895676f2836e8930b80807e5c75632d684b508ef7e67fed158c	pending	2026-07-27 06:10:21.567	\N	\N	2026-07-20 13:10:20.545562	\N
5	6	55	khoaldce181030@fpt.edu.vn	57	582154be1821e175d1300b764a039ae79a0d74fc880b24c15010eeeba23c80ee	canceled	2026-07-27 06:12:54.458	\N	2026-07-20 13:17:44.513053	2026-07-20 13:12:53.464136	\N
6	6	55	khoaldce181030@fpt.edu.vn	57	58c891ec6d2e09e8c40b6bc5b3cb5b6d515c07269033b7df536ea08966a680ef	accepted	2026-07-27 06:30:41.86	2026-07-20 13:31:06.808857	\N	2026-07-20 13:30:40.877107	\N
7	6	55	khoaldce181030@fpt.edu.vn	57	acda3c552cd8440ed7e3ff3c335259f6f2032f81eb1780f366c7c0dcc82fec5a	pending	2026-07-27 06:32:00.676	\N	\N	2026-07-20 13:31:59.676623	\N
8	6	62	hoantncs180622@fpt.edu.vn	57	76c84c46c508abe7bd91887f967a7ca416c12c9f5a95c54223cf4455c97efc82	accepted	2026-07-27 06:38:07.652	2026-07-20 13:38:57.355411	\N	2026-07-20 13:38:06.707787	\N
9	6	57	duongncce180374@fpt.edu.vn	62	690d88bcc4368c4e089ec67ce50b099e99abf9135e68891d5ec53d385521469e	accepted	2026-07-27 06:41:20.293	2026-07-20 13:43:09.101533	\N	2026-07-20 13:41:19.313407	\N
10	5	61	ledangkhoadz@gmail.com	55	c224469d3de03c1b91068c21408173abc02a2c6fe521a928077ecc812c3a577d	canceled	2026-07-27 08:26:10.569	\N	2026-07-20 15:26:57.349286	2026-07-20 15:26:09.598206	\N
11	5	61	ledangkhoadz@gmail.com	55	74c0775a14302f71b6ade2b803b406dcba9cb9fe4beb134ea0fe60fa676de9c1	pending	2026-07-27 08:28:01.373	\N	\N	2026-07-20 15:28:00.398188	\N
12	7	57	duongncce180374@fpt.edu.vn	50	64d12b86488221e77c1c0f321f3477f9e0d64c0dedd21b3eac2e74daf0d20c0c	accepted	2026-07-27 09:01:34.041	2026-07-20 16:01:52.386477	\N	2026-07-20 16:01:33.071864	\N
14	10	58	hoaipv.work@gmail.com	60	1d8fde7c6fce80e31ea5387496717df560fe324f5618686d43f8d8fd2cda5ff5	pending	2026-07-28 07:38:54.837	\N	\N	2026-07-21 14:38:53.88794	\N
13	9	60	phamvanhoaifpt@gmail.com	58	f283b647b253649bd37e351622d6a0cc00ead1c6b2c4bedc4fca426657904a51	canceled	2026-07-28 07:35:04.223	\N	2026-07-21 14:46:55.494325	2026-07-21 14:35:03.237437	\N
15	9	60	phamvanhoaifpt@gmail.com	58	dff525cd09885641cb888028c39873e518808cd4354f625626e0fa2056ed0abd	accepted	2026-07-28 07:47:40.746	2026-07-21 14:47:48.187991	\N	2026-07-21 14:47:39.791539	\N
\.


--
-- Data for Name: group_trip_itinerary_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_trip_itinerary_item (itinerary_item_id, group_trip_id, itinerary_date, start_time, title, description, location_id, custom_location, order_index, created_at, updated_at, latitude, longitude) FROM stdin;
2	1	2026-07-18	15:41:00	Cổng Bến Nhà Rồng	\N	\N	Cổng Bến Nhà Rồng	1	2026-07-18 16:42:05.115011	2026-07-18 17:15:35.995391	10.7680810	106.7061390
1	1	2026-07-18	19:31:00	Trường Đại học FPT Cần Thơ	\N	\N	Trường Đại học FPT Cần Thơ	1	2026-07-18 16:31:56.816845	2026-07-18 17:15:51.939944	10.0130910	105.7317140
3	5	2026-07-25	08:00:00	Đi Chơi	\N	1	\N	2	2026-07-20 13:08:39.140793	2026-07-20 13:19:47.362395	\N	\N
4	5	2026-07-25	13:00:00	Đi Chơi	\N	8	\N	1	2026-07-20 13:19:09.776637	2026-07-20 13:21:39.036689	\N	\N
5	9	2026-07-25	14:40:00	Cổng	\N	7	\N	1	2026-07-21 14:41:11.715043	2026-07-21 14:41:11.715043	\N	\N
6	9	2026-07-26	20:30:00	Tham Quan Gamma	\N	4	\N	1	2026-07-21 14:43:46.424223	2026-07-21 14:43:46.424223	\N	\N
7	11	2026-07-22	16:20:00	Gamma	\N	7	\N	1	2026-07-21 16:20:10.482004	2026-07-21 16:20:10.482004	\N	\N
8	11	2026-07-23	18:20:00	Alpha	\N	8	\N	1	2026-07-21 16:20:56.50836	2026-07-21 16:20:56.50836	\N	\N
\.


--
-- Data for Name: group_trip_member; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.group_trip_member (group_trip_member_id, group_trip_id, user_id, role, status, joined_at, left_at, removed_at, removed_by) FROM stdin;
2	1	60	member	active	2026-07-18 23:25:23.011992	\N	\N	\N
1	1	58	leader	active	2026-07-18 15:54:40.287037	\N	\N	\N
3	2	50	leader	active	2026-07-20 02:57:34.974109	\N	\N	\N
5	4	58	leader	active	2026-07-20 11:09:52.699401	\N	\N	\N
6	5	55	leader	active	2026-07-20 13:05:29.570756	\N	\N	\N
8	6	55	member	removed	2026-07-20 13:31:06.808857	\N	2026-07-20 13:31:38.052639	57
9	6	62	leader	active	2026-07-20 13:38:57.355411	\N	\N	\N
7	6	57	member	active	2026-07-20 13:43:09.101533	\N	\N	\N
11	7	50	leader	active	2026-07-20 16:00:50.461632	\N	\N	\N
12	7	57	member	active	2026-07-20 16:01:52.386477	\N	\N	\N
13	8	58	leader	active	2026-07-20 16:29:18.827346	\N	\N	\N
14	9	58	leader	active	2026-07-21 14:28:27.769924	\N	\N	\N
15	10	60	leader	active	2026-07-21 14:38:32.713284	\N	\N	\N
16	9	60	member	active	2026-07-21 14:47:48.187991	\N	\N	\N
17	11	58	leader	active	2026-07-21 16:18:01.644354	\N	\N	\N
20	13	1	leader	active	2026-07-22 00:08:34.293735	\N	\N	\N
21	13	3	member	active	2026-07-22 00:08:34.293735	\N	\N	\N
22	14	5	leader	active	2026-07-22 00:08:34.293735	\N	\N	\N
23	14	10	member	active	2026-07-22 00:08:34.293735	\N	\N	\N
24	15	1	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
25	15	3	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
26	16	3	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
27	16	5	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
28	17	5	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
29	17	10	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
30	18	10	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
31	18	11	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
32	19	11	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
33	19	50	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
34	20	50	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
35	20	55	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
36	21	55	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
37	21	56	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
38	22	56	leader	active	2026-07-22 00:15:54.274445	\N	\N	\N
39	22	57	member	active	2026-07-22 00:15:54.274445	\N	\N	\N
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.location (location_id, name, latitude, longitude, description, destination_id, created_at, updated_at, thumbnail, deleted_at, is_deleted) FROM stdin;
1	Cổng chính Dinh Độc Lập	10.777931	106.696295	Lối vào chính trên đường Nam Kỳ Khởi Nghĩa, thuận tiện để bắt đầu hành trình tham quan Dinh Độc Lập.	2	2026-05-25 14:10:47.810152	2026-06-23 19:56:06.358272	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	\N	f
2	Khuôn viên phía trước Dinh Độc Lập	10.777	106.695	Khuôn viên rộng, nhiều cây xanh và có góc nhìn đẹp về mặt tiền công trình.	2	2026-05-27 06:55:26.907004	2026-05-27 06:56:49.214091	\N	2026-05-27 06:56:49.214091	t
3	Cổng Bến Nhà Rồng	10.768081	106.706139	Lối vào Bảo tàng Hồ Chí Minh – Chi nhánh Thành phố Hồ Chí Minh, nhìn ra khu vực sông Sài Gòn.	3	2026-06-01 02:39:44.820265	2026-06-23 19:56:57.3134	https://s3.cloudfly.vn/travellens/locations/1782244304175-ben-nha-rong.jpg	\N	f
4	Tòa nhà Gamma	10.012885	105.730807	Tòa Gamma thuộc khuôn viên Trường Đại học FPT Cần Thơ, phục vụ học tập, sự kiện và các hoạt động cộng đồng sinh viên.	7	2026-06-02 15:19:36.554911	2026-07-01 22:05:49.725622	https://s3.cloudfly.vn/travellens/locations/1781623977782-0e04e76aedce4acc383c256e9fb7418c.jpg	\N	f
5	Sân ngắm cảnh Bến Nhà Rồng	10.76835	106.70642	Không gian thoáng bên sông Sài Gòn, phù hợp ngắm cảnh, tìm hiểu kiến trúc và chụp ảnh lưu niệm.	3	2026-06-02 16:31:23.516335	2026-07-05 20:37:51.198616	https://s3.cloudfly.vn/travellens/travel-feed/1783258673881-1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	\N	f
6	Khu trưng bày ngoài trời	10.7685	106.7062	Khu vực giới thiệu kiến trúc và cảnh quan bên ngoài Bến Nhà Rồng.	3	2026-06-16 13:58:15.95271	2026-06-16 14:11:36.64089	\N	2026-06-16 14:11:36.64089	t
7	Khu giới thiệu Đại học FPT Cần Thơ	10.013091	105.731714	Không gian giới thiệu tổng quan về chương trình đào tạo, đời sống sinh viên và kiến trúc của campus Cần Thơ.	7	2026-06-24 07:45:57.316679	2026-07-01 21:48:52.920449	\N	\N	f
8	Tòa nhà Alpha – Đại học FPT Cần Thơ	10.013772	105.731805	Tòa Alpha là công trình học tập hiện đại với thiết kế lấy cảm hứng từ họa tiết Penrose, gồm hệ thống phòng học và không gian chức năng phục vụ sinh viên.	7	2026-07-20 09:44:48.827633	2026-07-20 09:44:48.827633	\N	\N	f
59	Bến tàu chợ nổi	10.0102	105.751	Điểm đón khách lên thuyền để bắt đầu hành trình tham quan chợ nổi vào sáng sớm.	34	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=85	\N	f
60	Khu ghe ẩm thực	10.0055	105.7474	Khu vực tập trung các ghe phục vụ cà phê, bún riêu, hủ tiếu và đặc sản địa phương.	34	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1600&q=85	\N	f
57	Công viên Ninh Kiều	10.0348	105.789	Không gian đi bộ ven sông với hàng cây xanh và góc nhìn rộng ra dòng Hậu Giang.	33	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	\N	f
58	Cầu đi bộ Ninh Kiều	10.0362	105.7911	Cây cầu đi bộ nổi bật với thiết kế mềm mại, là vị trí ngắm cảnh và chụp ảnh đẹp vào buổi tối.	33	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	\N	f
61	Nhà chính Bình Thủy	10.0612	105.7586	Không gian kiến trúc chính với nội thất cổ, nền gạch hoa và các chi tiết trang trí tinh xảo.	35	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	\N	f
62	Vườn lan Bình Thủy	10.061	105.7582	Khu vườn xanh bao quanh nhà cổ, trồng nhiều giống hoa và cây cảnh đặc trưng.	35	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	\N	f
63	Chánh điện	9.9961	105.6737	Công trình trung tâm của thiền viện với kiến trúc gỗ truyền thống và không gian trang nghiêm.	36	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	\N	f
64	Vườn thiền	9.9958	105.6741	Khuôn viên yên tĩnh với hồ nước, cây xanh và lối đi dành cho khách tham quan.	36	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	\N	f
65	Vườn trái cây Cồn Sơn	10.1153	105.7358	Khu vườn theo mùa, nơi du khách tìm hiểu cách chăm sóc và thưởng thức trái cây tại chỗ.	37	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	\N	f
66	Khu làm bánh dân gian	10.1148	105.7354	Không gian trải nghiệm làm bánh lá mít, bánh khọt và các món bánh truyền thống Nam Bộ.	37	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	\N	f
127	Khuê Văn Các	21.0287	105.8357	Khuê Văn Các là một vị trí tham quan quan trọng thuộc Văn Miếu – Quốc Tử Giám, có biển hướng dẫn và không gian thuận tiện cho du khách.	68	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	\N	f
128	Nhà Thái Học	21.0289	105.8359	Nhà Thái Học là một vị trí tham quan quan trọng thuộc Văn Miếu – Quốc Tử Giám, có biển hướng dẫn và không gian thuận tiện cho du khách.	68	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	\N	f
129	Đoan Môn	21.0354	105.8405	Đoan Môn là một vị trí tham quan quan trọng thuộc Hoàng thành Thăng Long, có biển hướng dẫn và không gian thuận tiện cho du khách.	69	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	\N	f
130	Khu khảo cổ 18 Hoàng Diệu	21.0356	105.8407	Khu khảo cổ 18 Hoàng Diệu là một vị trí tham quan quan trọng thuộc Hoàng thành Thăng Long, có biển hướng dẫn và không gian thuận tiện cho du khách.	69	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	\N	f
131	Ngọ Môn	16.4697	107.57820000000001	Ngọ Môn là một vị trí tham quan quan trọng thuộc Đại Nội Huế, có biển hướng dẫn và không gian thuận tiện cho du khách.	70	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	\N	f
132	Điện Thái Hòa	16.4699	107.5784	Điện Thái Hòa là một vị trí tham quan quan trọng thuộc Đại Nội Huế, có biển hướng dẫn và không gian thuận tiện cho du khách.	70	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	\N	f
133	Tháp Phước Duyên	16.4534	107.5451	Tháp Phước Duyên là một vị trí tham quan quan trọng thuộc Chùa Thiên Mụ, có biển hướng dẫn và không gian thuận tiện cho du khách.	71	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	\N	f
134	Điện Đại Hùng	16.453599999999998	107.5453	Điện Đại Hùng là một vị trí tham quan quan trọng thuộc Chùa Thiên Mụ, có biển hướng dẫn và không gian thuận tiện cho du khách.	71	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	\N	f
135	Chùa Cầu	15.8803	108.3382	Chùa Cầu là một vị trí tham quan quan trọng thuộc Phố cổ Hội An, có biển hướng dẫn và không gian thuận tiện cho du khách.	72	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	\N	f
136	Hội quán Phúc Kiến	15.880500000000001	108.3384	Hội quán Phúc Kiến là một vị trí tham quan quan trọng thuộc Phố cổ Hội An, có biển hướng dẫn và không gian thuận tiện cho du khách.	72	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	\N	f
137	Cầu Vàng	15.9979	107.98830000000001	Cầu Vàng là một vị trí tham quan quan trọng thuộc Bà Nà Hills, có biển hướng dẫn và không gian thuận tiện cho du khách.	73	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	\N	f
138	Làng Pháp	15.9981	107.9885	Làng Pháp là một vị trí tham quan quan trọng thuộc Bà Nà Hills, có biển hướng dẫn và không gian thuận tiện cho du khách.	73	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	\N	f
139	Cửa Nam	10.7727	106.6982	Cửa Nam là một vị trí tham quan quan trọng thuộc Chợ Bến Thành, có biển hướng dẫn và không gian thuận tiện cho du khách.	74	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	\N	f
140	Khu ẩm thực	10.772900000000002	106.69839999999999	Khu ẩm thực là một vị trí tham quan quan trọng thuộc Chợ Bến Thành, có biển hướng dẫn và không gian thuận tiện cho du khách.	74	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	\N	f
141	Tòa nhà chính	10.7701	106.7001	Tòa nhà chính là một vị trí tham quan quan trọng thuộc Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh, có biển hướng dẫn và không gian thuận tiện cho du khách.	75	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	\N	f
142	Khu trưng bày nghệ thuật hiện đại	10.7703	106.7003	Khu trưng bày nghệ thuật hiện đại là một vị trí tham quan quan trọng thuộc Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh, có biển hướng dẫn và không gian thuận tiện cho du khách.	75	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	\N	f
143	Chùa Bà	11.3711	106.17200000000001	Chùa Bà là một vị trí tham quan quan trọng thuộc Núi Bà Đen, có biển hướng dẫn và không gian thuận tiện cho du khách.	76	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	\N	f
144	Đỉnh Vân Sơn	11.371300000000002	106.1722	Đỉnh Vân Sơn là một vị trí tham quan quan trọng thuộc Núi Bà Đen, có biển hướng dẫn và không gian thuận tiện cho du khách.	76	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	\N	f
145	Trạm quan sát chim	10.7255	105.5167	Trạm quan sát chim là một vị trí tham quan quan trọng thuộc Vườn quốc gia Tràm Chim, có biển hướng dẫn và không gian thuận tiện cho du khách.	77	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	\N	f
146	Tuyến xuồng xuyên rừng	10.725700000000002	105.51689999999999	Tuyến xuồng xuyên rừng là một vị trí tham quan quan trọng thuộc Vườn quốc gia Tràm Chim, có biển hướng dẫn và không gian thuận tiện cho du khách.	77	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	\N	f
147	Bãi tắm trung tâm	10.0582	104.037	Bãi tắm trung tâm là một vị trí tham quan quan trọng thuộc Bãi Sao Phú Quốc, có biển hướng dẫn và không gian thuận tiện cho du khách.	78	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	\N	f
148	Khu chèo kayak	10.0584	104.0372	Khu chèo kayak là một vị trí tham quan quan trọng thuộc Bãi Sao Phú Quốc, có biển hướng dẫn và không gian thuận tiện cho du khách.	78	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	\N	f
149	Nhà trưng bày	10.045499999999999	104.01740000000001	Nhà trưng bày là một vị trí tham quan quan trọng thuộc Nhà tù Phú Quốc, có biển hướng dẫn và không gian thuận tiện cho du khách.	79	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	\N	f
150	Khu tái hiện lịch sử	10.0457	104.0176	Khu tái hiện lịch sử là một vị trí tham quan quan trọng thuộc Nhà tù Phú Quốc, có biển hướng dẫn và không gian thuận tiện cho du khách.	79	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	\N	f
151	Cầu cảng Hàm Ninh	10.177	104.05000000000001	Cầu cảng Hàm Ninh là một vị trí tham quan quan trọng thuộc Làng chài Hàm Ninh, có biển hướng dẫn và không gian thuận tiện cho du khách.	80	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	\N	f
152	Khu hải sản	10.177200000000001	104.0502	Khu hải sản là một vị trí tham quan quan trọng thuộc Làng chài Hàm Ninh, có biển hướng dẫn và không gian thuận tiện cho du khách.	80	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	\N	f
153	Bàu Sấu	11.4237	107.42830000000001	Bàu Sấu là một vị trí tham quan quan trọng thuộc Vườn quốc gia Cát Tiên, có biển hướng dẫn và không gian thuận tiện cho du khách.	81	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	\N	f
154	Tuyến cây cổ thụ	11.423900000000001	107.4285	Tuyến cây cổ thụ là một vị trí tham quan quan trọng thuộc Vườn quốc gia Cát Tiên, có biển hướng dẫn và không gian thuận tiện cho du khách.	81	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	\N	f
155	Sảnh chính	10.7767	106.70320000000001	Sảnh chính là một vị trí tham quan quan trọng thuộc Nhà hát Thành phố Hồ Chí Minh, có biển hướng dẫn và không gian thuận tiện cho du khách.	82	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	\N	f
156	Khán phòng	10.776900000000001	106.7034	Khán phòng là một vị trí tham quan quan trọng thuộc Nhà hát Thành phố Hồ Chí Minh, có biển hướng dẫn và không gian thuận tiện cho du khách.	82	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	\N	f
157	Khu trò chơi dân gian Ông Đề	9.9907	105.7091	Không gian trò chơi dân gian giữa cảnh quan miệt vườn, với cầu gỗ, chòi lá và các hoạt động tập thể đặc trưng miền Tây.	6	2026-07-22 01:23:58.08909	2026-07-22 01:23:58.08909	https://s3.cloudfly.vn/travellens/view360-images/1784658243795-ong-de-folk-games-360.png	\N	f
158	Phòng khánh tiết Dinh Độc Lập	10.7772	106.6955	Không gian tiếp đón trang trọng bên trong Dinh Độc Lập, thể hiện phong cách kiến trúc và nội thất tiêu biểu của công trình.	8	2026-07-22 01:23:59.475867	2026-07-22 01:23:59.475867	https://s3.cloudfly.vn/travellens/view360-images/1784658245730-dinh-doc-lap-reception-hall-360.png	\N	f
\.


--
-- Data for Name: map; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.map (map_id, location_id, map_file, description, title, display_order, created_at, updated_at, deleted_at, is_deleted) FROM stdin;
153	157	https://s3.cloudfly.vn/travellens/maps/1784693681801-so-do-lang-du-lich-sinh-thai-ong-de-6.svg	Sơ đồ tham quan Làng du lịch sinh thái Ông Đề, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu trò chơi dân gian Ông Đề	1	2026-07-22 01:23:58.08909	2026-07-22 11:14:37.334844	\N	f
154	158	https://s3.cloudfly.vn/travellens/maps/1784693682049-so-do-dinh-doc-lap-khong-gian-trung-bay-8.svg	Sơ đồ tham quan Dinh Độc Lập – Không gian trưng bày, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Phòng khánh tiết Dinh Độc Lập	1	2026-07-22 01:23:59.475867	2026-07-22 11:14:37.334844	\N	f
3	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	\N	Ground Floor firts Map	1	2026-05-26 14:45:38.63074	2026-05-26 15:37:20.375993	2026-05-26 15:37:20.375993	t
1	1	https://s3.cloudfly.vn/travellens/maps/1784693681668-so-do-dinh-doc-lap-2.svg	Sơ đồ tham quan Dinh Độc Lập, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Cổng chính Dinh Độc Lập	1	2026-05-26 14:45:38.63074	2026-07-22 11:14:37.334844	\N	f
10	1	https://s3.cloudfly.vn/travellens/maps/1784693681668-so-do-dinh-doc-lap-2.svg	Sơ đồ tham quan Dinh Độc Lập, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Cổng chính Dinh Độc Lập	\N	2026-06-24 07:11:18.501771	2026-07-22 11:14:37.334844	\N	f
8	4	https://s3.cloudfly.vn/travellens/maps/1784693681916-so-do-truong-dai-hoc-fpt-can-tho-7.svg	Sơ đồ tham quan Trường Đại học FPT Cần Thơ, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Tòa nhà Gamma	\N	2026-06-23 07:18:51.42382	2026-07-22 11:14:37.334844	\N	f
53	57	https://s3.cloudfly.vn/travellens/maps/1784693682155-so-do-ben-ninh-kieu-33.svg	Sơ đồ tham quan Bến Ninh Kiều, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Công viên Ninh Kiều	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
54	58	https://s3.cloudfly.vn/travellens/maps/1784693682155-so-do-ben-ninh-kieu-33.svg	Sơ đồ tham quan Bến Ninh Kiều, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Cầu đi bộ Ninh Kiều	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
55	59	https://s3.cloudfly.vn/travellens/maps/1784693682281-so-do-cho-noi-cai-rang-34.svg	Sơ đồ tham quan Chợ nổi Cái Răng, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Bến tàu chợ nổi	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
123	127	https://s3.cloudfly.vn/travellens/maps/1784693682754-so-do-van-mieu-quoc-tu-giam-68.svg	Sơ đồ tham quan Văn Miếu – Quốc Tử Giám, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khuê Văn Các	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
124	128	https://s3.cloudfly.vn/travellens/maps/1784693682754-so-do-van-mieu-quoc-tu-giam-68.svg	Sơ đồ tham quan Văn Miếu – Quốc Tử Giám, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Nhà Thái Học	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
125	129	https://s3.cloudfly.vn/travellens/maps/1784693683022-so-do-hoang-thanh-thang-long-69.svg	Sơ đồ tham quan Hoàng thành Thăng Long, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Đoan Môn	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
126	130	https://s3.cloudfly.vn/travellens/maps/1784693683022-so-do-hoang-thanh-thang-long-69.svg	Sơ đồ tham quan Hoàng thành Thăng Long, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu khảo cổ 18 Hoàng Diệu	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
127	131	https://s3.cloudfly.vn/travellens/maps/1784693683138-so-do-dai-noi-hue-70.svg	Sơ đồ tham quan Đại Nội Huế, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Ngọ Môn	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
128	132	https://s3.cloudfly.vn/travellens/maps/1784693683138-so-do-dai-noi-hue-70.svg	Sơ đồ tham quan Đại Nội Huế, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Điện Thái Hòa	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
129	133	https://s3.cloudfly.vn/travellens/maps/1784693683248-so-do-chua-thien-mu-71.svg	Sơ đồ tham quan Chùa Thiên Mụ, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Tháp Phước Duyên	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
4	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	final test update	duong	2	2026-05-26 15:42:21.405882	2026-05-26 15:44:24.820618	2026-05-26 15:44:24.820618	t
5	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	Ground floor layout	test	1	2026-05-26 15:48:13.39777	2026-05-26 15:48:38.093523	2026-05-26 15:48:38.093523	t
6	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	no	test update map	2	2026-05-27 06:59:42.580568	2026-05-27 07:01:35.743387	2026-05-27 07:01:35.743387	t
2	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg		NCD	2	2026-05-26 14:45:38.63074	2026-06-23 07:43:54.387548	2026-06-23 07:43:54.387548	t
7	4	https://s3.cloudfly.vn/travellens/locations/1781623977782-0e04e76aedce4acc383c256e9fb7418c.jpg	Updated layout	Alpha	2	2026-06-02 15:26:13.704762	2026-06-23 07:44:23.380766	2026-06-23 07:44:23.380766	t
9	3	https://s3.cloudfly.vn/travellens/locations/1782244304175-ben-nha-rong.jpg	Bến 1 có 3 tàu lớn và 3 tàu nhỏ	Bến 1	0	2026-06-23 17:14:54.352239	2026-06-23 17:15:36.247671	2026-06-23 17:15:36.247671	t
130	134	https://s3.cloudfly.vn/travellens/maps/1784693683248-so-do-chua-thien-mu-71.svg	Sơ đồ tham quan Chùa Thiên Mụ, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Điện Đại Hùng	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
131	135	https://s3.cloudfly.vn/travellens/maps/1784693683366-so-do-pho-co-hoi-an-72.svg	Sơ đồ tham quan Phố cổ Hội An, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Chùa Cầu	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
132	136	https://s3.cloudfly.vn/travellens/maps/1784693683366-so-do-pho-co-hoi-an-72.svg	Sơ đồ tham quan Phố cổ Hội An, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Hội quán Phúc Kiến	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
133	137	https://s3.cloudfly.vn/travellens/maps/1784693683480-so-do-ba-na-hills-73.svg	Sơ đồ tham quan Bà Nà Hills, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Cầu Vàng	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
134	138	https://s3.cloudfly.vn/travellens/maps/1784693683480-so-do-ba-na-hills-73.svg	Sơ đồ tham quan Bà Nà Hills, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Làng Pháp	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
135	139	https://s3.cloudfly.vn/travellens/maps/1784693683590-so-do-cho-ben-thanh-74.svg	Sơ đồ tham quan Chợ Bến Thành, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Cửa Nam	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
136	140	https://s3.cloudfly.vn/travellens/maps/1784693683590-so-do-cho-ben-thanh-74.svg	Sơ đồ tham quan Chợ Bến Thành, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu ẩm thực	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
137	141	https://s3.cloudfly.vn/travellens/maps/1784693683693-so-do-bao-tang-my-thuat-thanh-pho-ho-chi-minh-75.svg	Sơ đồ tham quan Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Tòa nhà chính	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
138	142	https://s3.cloudfly.vn/travellens/maps/1784693683693-so-do-bao-tang-my-thuat-thanh-pho-ho-chi-minh-75.svg	Sơ đồ tham quan Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu trưng bày nghệ thuật hiện đại	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
139	143	https://s3.cloudfly.vn/travellens/maps/1784693683884-so-do-nui-ba-den-76.svg	Sơ đồ tham quan Núi Bà Đen, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Chùa Bà	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
140	144	https://s3.cloudfly.vn/travellens/maps/1784693683884-so-do-nui-ba-den-76.svg	Sơ đồ tham quan Núi Bà Đen, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Đỉnh Vân Sơn	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
142	146	https://s3.cloudfly.vn/travellens/maps/1784693684112-so-do-vuon-quoc-gia-tram-chim-77.svg	Sơ đồ tham quan Vườn quốc gia Tràm Chim, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Tuyến xuồng xuyên rừng	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
141	145	https://s3.cloudfly.vn/travellens/maps/1784693684112-so-do-vuon-quoc-gia-tram-chim-77.svg	Sơ đồ tham quan Vườn quốc gia Tràm Chim, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Trạm quan sát chim	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
143	147	https://s3.cloudfly.vn/travellens/maps/1784693684212-so-do-bai-sao-phu-quoc-78.svg	Sơ đồ tham quan Bãi Sao Phú Quốc, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Bãi tắm trung tâm	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
144	148	https://s3.cloudfly.vn/travellens/maps/1784693684212-so-do-bai-sao-phu-quoc-78.svg	Sơ đồ tham quan Bãi Sao Phú Quốc, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu chèo kayak	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
145	149	https://s3.cloudfly.vn/travellens/maps/1784693684320-so-do-nha-tu-phu-quoc-79.svg	Sơ đồ tham quan Nhà tù Phú Quốc, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Nhà trưng bày	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
146	150	https://s3.cloudfly.vn/travellens/maps/1784693684320-so-do-nha-tu-phu-quoc-79.svg	Sơ đồ tham quan Nhà tù Phú Quốc, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu tái hiện lịch sử	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
147	151	https://s3.cloudfly.vn/travellens/maps/1784693684425-so-do-lang-chai-ham-ninh-80.svg	Sơ đồ tham quan Làng chài Hàm Ninh, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Cầu cảng Hàm Ninh	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
148	152	https://s3.cloudfly.vn/travellens/maps/1784693684425-so-do-lang-chai-ham-ninh-80.svg	Sơ đồ tham quan Làng chài Hàm Ninh, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu hải sản	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
149	153	https://s3.cloudfly.vn/travellens/maps/1784693684538-so-do-vuon-quoc-gia-cat-tien-81.svg	Sơ đồ tham quan Vườn quốc gia Cát Tiên, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Bàu Sấu	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
150	154	https://s3.cloudfly.vn/travellens/maps/1784693684538-so-do-vuon-quoc-gia-cat-tien-81.svg	Sơ đồ tham quan Vườn quốc gia Cát Tiên, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Tuyến cây cổ thụ	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
151	155	https://s3.cloudfly.vn/travellens/maps/1784693684640-so-do-nha-hat-thanh-pho-ho-chi-minh-82.svg	Sơ đồ tham quan Nhà hát Thành phố Hồ Chí Minh, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Sảnh chính	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
152	156	https://s3.cloudfly.vn/travellens/maps/1784693684640-so-do-nha-hat-thanh-pho-ho-chi-minh-82.svg	Sơ đồ tham quan Nhà hát Thành phố Hồ Chí Minh, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khán phòng	1	2026-07-22 00:15:54.274445	2026-07-22 11:14:37.334844	\N	f
56	60	https://s3.cloudfly.vn/travellens/maps/1784693682281-so-do-cho-noi-cai-rang-34.svg	Sơ đồ tham quan Chợ nổi Cái Răng, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu ghe ẩm thực	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
57	61	https://s3.cloudfly.vn/travellens/maps/1784693682407-so-do-nha-co-binh-thuy-35.svg	Sơ đồ tham quan Nhà cổ Bình Thủy, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Nhà chính Bình Thủy	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
58	62	https://s3.cloudfly.vn/travellens/maps/1784693682407-so-do-nha-co-binh-thuy-35.svg	Sơ đồ tham quan Nhà cổ Bình Thủy, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Vườn lan Bình Thủy	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
59	63	https://s3.cloudfly.vn/travellens/maps/1784693682518-so-do-thien-vien-truc-lam-phuong-nam-36.svg	Sơ đồ tham quan Thiền viện Trúc Lâm Phương Nam, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Chánh điện	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
60	64	https://s3.cloudfly.vn/travellens/maps/1784693682518-so-do-thien-vien-truc-lam-phuong-nam-36.svg	Sơ đồ tham quan Thiền viện Trúc Lâm Phương Nam, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Vườn thiền	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
61	65	https://s3.cloudfly.vn/travellens/maps/1784693682639-so-do-con-son-37.svg	Sơ đồ tham quan Cồn Sơn, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Vườn trái cây Cồn Sơn	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
62	66	https://s3.cloudfly.vn/travellens/maps/1784693682639-so-do-con-son-37.svg	Sơ đồ tham quan Cồn Sơn, hiển thị các điểm và tuyến tham quan gợi ý.	Sơ đồ Khu làm bánh dân gian	1	2026-07-22 00:08:34.293735	2026-07-22 11:14:37.334844	\N	f
\.


--
-- Data for Name: media_file; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media_file (media_id, uploaded_by, original_name, file_name, file_url, mime_type, file_size, created_at, updated_at, deleted_at) FROM stdin;
1	2	Createbookingt.drawio.png	1782124132690-Createbookingt-drawio.png	https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png	image/png	357138	2026-06-22 10:28:55.445017	2026-06-22 10:28:55.445017	\N
2	2	The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	image/jpeg	178810	2026-06-23 09:03:17.313228	2026-06-23 09:03:17.313228	\N
3	2	Delete review.drawio.png	1782214256372-Delete-review-drawio.png	https://s3.cloudfly.vn/travellens/media/1782214256372-Delete-review-drawio.png	image/png	262670	2026-06-23 11:30:59.016502	2026-06-23 11:30:59.016502	\N
4	2	PaymentStatusUpdate.drawio.png	1782214382526-PaymentStatusUpdate-drawio.png	https://s3.cloudfly.vn/travellens/media/1782214382526-PaymentStatusUpdate-drawio.png	image/png	74572	2026-06-23 11:33:04.507028	2026-06-23 11:33:04.507028	\N
5	2	truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	https://s3.cloudfly.vn/travellens/media/1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg	image/jpeg	1614883	2026-06-23 19:46:22.394561	2026-06-23 19:46:22.394561	\N
\.


--
-- Data for Name: password_reset_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_codes (reset_code_id, user_id, code_hash, reset_token_hash, expires_at, verified_at, used_at, created_at) FROM stdin;
1	4	430c49cf700b85e7725f64ee2d39e59dd3ca91f1704048e320b53a2c89d18778	21ccc9f0bacdc9180a2586b3ed4358475aa750f9c186204bcf4b878654ae12fd	2026-05-27 13:57:06.29	2026-05-27 06:47:50.196984	2026-05-27 06:48:18.232206	2026-05-27 06:47:06.289637
9	56	7055b2aa4ba825d931a47f758e2957e1870222dd05d3bbb1a45cdb9788a0adb6	9f943e8c18c556983e81bac8f8cf6d525faeaba73677a92f27364e5eaa2f1773	2026-06-24 07:12:00.133	2026-06-24 07:02:19.71362	2026-06-24 07:02:33.456931	2026-06-24 07:02:00.217367
11	57	fb9365a5414721f05ba471a9e579fe71260f8d9308bb99b74236fe9119a9bc43	\N	2026-06-29 08:39:46.56	\N	\N	2026-06-29 15:29:46.64939
10	57	4a5288faa8de11ace63a74c48c1c7f0e33c479a3029454fe59c9140cc9f89268	309dec100a68a6c7ae1e943d59267c949692578510a8f442adb1062da1041c59	2026-06-29 15:37:33.983	2026-06-29 15:30:57.028748	2026-06-29 15:32:24.377506	2026-06-29 15:27:34.403919
12	60	dd49b4bfcc94ae1a6d9f305c691e5ac41ecfcd5934df728d84109f3d30fb6d86	9fb7a24edae3b6b1067ddcd72a9f84821ecde80cac2c47215c48c6a6a7edd259	2026-07-21 16:04:33.346837	2026-07-21 15:55:02.925933	2026-07-21 15:55:15.054702	2026-07-21 15:54:33.346837
\.


--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payment (payment_id, booking_id, amount, payment_method, payment_date, status, transaction_code, currency, payment_code, payment_provider, sepay_transaction_id, bank_account, transfer_content, paid_at, expired_at, created_at, updated_at, deleted_at) FROM stdin;
60	90	2363000	bank_transfer	\N	paid	FT262210458721	VND	TVLCT001	sepay	\N	\N	TVLCT001	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
61	91	650000	bank_transfer	\N	paid	FT262211037864	VND	TVLCT002	sepay	\N	\N	TVLCT002	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
62	92	1480000	bank_transfer	\N	pending	\N	VND	TVLCT003	sepay	\N	\N	TVLCT003	\N	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
63	93	3790000	bank_transfer	\N	paid	FT262212349105	VND	TVLCT004	sepay	\N	\N	TVLCT004	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
64	94	980000	bank_transfer	\N	refunded	FT262213882417	VND	TVLCT005	sepay	\N	\N	TVLCT005	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
65	95	1290000	bank_transfer	\N	pending	\N	VND	TVLCT006	sepay	\N	\N	TVLCT006	\N	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
66	96	1759500	bank_transfer	\N	paid	FT262214773209	VND	TVLCT007	sepay	\N	\N	TVLCT007	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
67	97	1690000	bank_transfer	\N	expired	\N	VND	TVLCT008	sepay	\N	\N	TVLCT008	\N	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
68	98	1070000	bank_transfer	\N	paid	FT262215630842	VND	TVLCT009	sepay	\N	\N	TVLCT009	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
69	99	6680000	bank_transfer	\N	paid	FT262216998351	VND	TVLCT010	sepay	\N	\N	TVLCT010	2026-07-20 00:08:34.293735	2026-07-24 00:08:34.293735	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
156	186	7670000	bank_transfer	\N	pending	\N	VND	TVLVN027	sepay	\N	\N	TVLVN027	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
157	187	2601000	bank_transfer	\N	expired	\N	VND	TVLVN028	sepay	\N	\N	TVLVN028	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
158	188	31980000	bank_transfer	\N	pending	\N	VND	TVLVN029	sepay	\N	\N	TVLVN029	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
159	189	92700000	bank_transfer	\N	pending	\N	VND	TVLVN030	sepay	\N	\N	TVLVN030	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
2	7	688500	bank_transfer	\N	paid	FT26152540980426	VND	TVL00000798EB92	sepay	61401120	6511223344	131564661280-TVL00000798EB92-CHUYEN TIEN-OQCH000Ch0ia-MOMO131564661280MOMO	2026-06-01 17:16:00	2026-06-01 17:31:12.865	2026-06-01 10:16:09.067709	2026-06-01 10:24:20.916449	\N
3	8	688950	bank_transfer	\N	paid	FT26153909675060	VND	TVL0000084AE6AC	sepay	61551766	6511223344	131711831923-TVL0000084AE6AC-CHUYEN TIEN-OQCH000Cknap-MOMO131711831923MOMO	2026-06-02 17:35:00	2026-06-02 10:48:44.867	2026-06-02 10:33:44.033965	2026-06-02 10:35:08.745956	\N
5	10	690000	bank_transfer	\N	paid	FT26154072156190	VND	TVL00001034C584	sepay	61595096	6511223344	131753592440-TVL00001034C584-CHUYEN TIEN-OQCH000Cm3pW-MOMO131753592440MOMO	2026-06-02 22:37:00	2026-06-02 15:49:51.951	2026-06-02 15:34:51.111612	2026-06-02 15:37:29.915624	\N
4	9	689936	bank_transfer	\N	expired	\N	VND	TVL0000093162B0	sepay	\N	6511223344	TVL0000093162B0	\N	2026-06-02 15:46:41.771	2026-06-02 15:31:40.921577	2026-06-02 16:25:56.42968	\N
6	18	350000	bank_transfer	\N	expired	\N	VND	TVL00001830B0AA	sepay	\N	6511223344	TVL00001830B0AA	\N	2026-06-24 18:59:48.877	2026-06-24 18:44:48.08023	2026-06-24 18:46:23.203736	\N
7	19	350000	bank_transfer	\N	paid	FT26176508048684	VND	TVL000019FF0F1B	sepay	64902587	6511223344	134805249220-TVL000019FF0F1B-CHUYEN TIEN-OQCH000EGDZN-MOMO134805249220MOMO	2026-06-25 01:47:00	2026-06-24 19:02:03.633	2026-06-24 18:47:02.821753	2026-06-24 18:47:41.490357	\N
9	21	1250000	bank_transfer	\N	paid	FT26176098407160	VND	TVL0000210F6C27	sepay	64903150	6511223344	134805696590-TVL0000210F6C27-CHUYEN TIEN-OQCH000EGE66-MOMO134805696590MOMO	2026-06-25 01:56:00	2026-06-24 19:11:38.945	2026-06-24 18:56:38.139751	2026-06-24 18:56:54.744645	\N
10	22	350000	bank_transfer	\N	paid	FT26178208683147	VND	TVL000022FE9595	sepay	65364513	6511223344	135166597124-TVL000022FE9595-CHUYEN TIEN-OQCH000ERr3O-MOMO135166597124MOMO	2026-06-27 19:51:00	2026-06-27 13:05:49.431	2026-06-27 12:50:48.608913	2026-06-27 12:51:13.909989	\N
11	23	350000	bank_transfer	\N	paid	FT26178950257184	VND	TVL000023C630B5	sepay	65366122	6511223344	135167887857-TVL000023C630B5-CHUYEN TIEN-OQCH000ERuGy-MOMO135167887857MOMO	2026-06-27 20:01:00	2026-06-27 13:16:28.993	2026-06-27 13:01:28.182263	2026-06-27 13:01:50.084087	\N
12	24	1250000	bank_transfer	\N	paid	FT26178737117222	VND	TVL00002460ECA7	sepay	65368917	6511223344	135170335687-TVL00002460ECA7-CHUYEN TIEN-OQCH000ERzbk-MOMO135170335687MOMO	2026-06-27 20:19:00	2026-06-27 13:33:54.405	2026-06-27 13:18:53.610069	2026-06-27 13:19:10.433041	\N
13	25	712000	bank_transfer	\N	paid	FT26180400499706	VND	TVL00002529220F	sepay	65626271	6511223344	135384837172-TVL00002529220F-CHUYEN TIEN-OQCH000EYldB-MOMO135384837172MOMO	2026-06-29 14:34:00	2026-06-29 07:49:18.314	2026-06-29 14:34:17.519113	2026-06-29 14:34:37.762009	\N
8	20	880000	bank_transfer	\N	expired	\N	VND	TVL000020377027	sepay	\N	6511223344	TVL000020377027	\N	2026-06-24 19:10:07.955	2026-06-24 18:55:07.092142	2026-06-29 15:22:01.697084	\N
14	30	890000	bank_transfer	\N	expired	\N	VND	TVL0000302D7B72	sepay	\N	6511223344	TVL0000302D7B72	\N	2026-06-29 09:23:19.648	2026-06-29 16:08:18.843319	2026-06-29 16:09:01.206972	\N
15	31	350000	bank_transfer	\N	refunded	FT26180073593678	VND	TVL000031FE8983	sepay	65648744	6511223344	135400463963-TVL000031FE8983-CHUYEN TIEN-OQCH000EZGmC-MOMO135400463963MOMO	2026-06-29 17:01:00	2026-06-29 17:16:12.151012	2026-06-29 17:01:12.151012	2026-06-29 18:04:38.898635	\N
16	32	350000	bank_transfer	\N	refunded	147852	VND	TVL000032F241B1	sepay	65662559	6511223344	135410719789-TVL000032F241B1-CHUYEN TIEN-OQCH000EZXiM-MOMO135410719789MOMO	2026-06-29 18:11:00	2026-06-29 18:25:43.916176	2026-06-29 18:10:43.916176	2026-06-29 18:39:14.872021	\N
18	34	350000	bank_transfer	\N	paid	FT26180570650167	VND	TVL0000347D0E61	sepay	65670623	6511223344	135417759773-TVL0000347D0E61-CHUYEN TIEN-OQCH000EZm2t-MOMO135417759773MOMO	2026-06-29 18:58:00	2026-06-29 19:12:55.266723	2026-06-29 18:57:55.266723	2026-06-29 18:58:14.586359	\N
19	35	1896000	bank_transfer	\N	refunded	432515	VND	TVL0000357CFDBC	sepay	65678882	6511223344	135424628153-TVL0000357CFDBC-CHUYEN TIEN-OQCH000Ea0Q5-MOMO135424628153MOMO	2026-06-29 19:47:00	2026-06-29 20:02:21.47988	2026-06-29 19:47:21.47988	2026-06-29 20:06:48.378527	\N
25	41	350000	bank_transfer	\N	refunded	Request #9 for booking BK-41.	VND	TVL000041B61503	sepay	65692984	6511223344	135435633154-TVL000041B61503-CHUYEN TIEN-OQCH000EaNHG-MOMO135435633154MOMO	2026-06-29 21:14:00	2026-06-29 21:29:32.558247	2026-06-29 21:14:32.558247	2026-06-29 21:30:03.149202	\N
27	43	600000	bank_transfer	\N	paid	FT26181892263970	VND	TVL00004357445B	sepay	65707025	6511223344	135445921323-TVL00004357445B-CHUYEN TIEN-OQCH000EakVL-MOMO135445921323MOMO	2026-06-29 23:10:00	2026-06-29 23:23:08.084097	2026-06-29 23:08:08.084097	2026-06-29 23:10:08.328083	\N
29	45	597525	bank_transfer	\N	paid	FT26181866104884	VND	TVL000045E40657	sepay	65713026	6511223344	135449819136-TVL000045E40657-CHUYEN TIEN-OQCH000EarN8-MOMO135449819136MOMO	2026-06-30 00:16:00	2026-06-30 00:29:34.812524	2026-06-30 00:14:34.812524	2026-06-30 00:16:07.849359	\N
20	36	350000	bank_transfer	\N	expired	\N	VND	TVL00003611AF82	sepay	\N	6511223344	TVL00003611AF82	\N	2026-06-29 20:44:15.659653	2026-06-29 20:29:15.659653	2026-06-30 00:37:31.031646	\N
42	68	350000	bank_transfer	\N	paid	FT26201099229076	VND	TVL0000688DD813	sepay	69120531	6511223344	138523640262-TVL0000688DD813-CHUYEN TIEN-OQCH000G5BZb-MOMO138523640262MOMO	2026-07-20 16:23:00	2026-07-20 16:37:44.625719	2026-07-20 16:22:44.625719	2026-07-20 16:23:10.337519	\N
43	70	697000	bank_transfer	\N	paid	FT26202911719227	VND	TVL00007079682D	sepay	69198764	6511223344	138585775815-TVL00007079682D-CHUYEN TIEN-OQCH000G7Ld0-MOMO138585775815MOMO	2026-07-21 01:32:00	2026-07-21 01:47:17.545516	2026-07-21 01:32:17.545516	2026-07-21 01:33:01.161866	\N
45	72	697000	bank_transfer	\N	paid	FT26202087091790	VND	TVL000072C4035C	sepay	69198929	6511223344	138585960663-TVL000072C4035C-CHUYEN TIEN-OQCH000G7M0D-MOMO138585960663MOMO	2026-07-21 01:39:00	2026-07-21 01:53:38.721351	2026-07-21 01:38:38.721351	2026-07-21 01:39:03.75847	\N
44	71	350000	bank_transfer	\N	expired	\N	VND	TVL000071AB26DB	sepay	\N	6511223344	TVL000071AB26DB	\N	2026-07-21 01:50:02.546477	2026-07-21 01:35:02.546477	2026-07-21 01:50:44.164436	\N
46	73	697000	bank_transfer	\N	expired	\N	VND	TVL000073120DBF	sepay	\N	6511223344	TVL000073120DBF	\N	2026-07-21 15:56:22.478785	2026-07-21 15:41:22.478785	2026-07-21 15:57:56.564368	\N
47	74	697000	bank_transfer	\N	paid	FT26202631760083	VND	TVL00007453AA56	sepay	69283270	6511223344	138663026258-TVL00007453AA56-CHUYEN TIEN-OQCH000G9VNp-MOMO138663026258MOMO	2026-07-21 16:11:00	2026-07-21 16:25:37.750474	2026-07-21 16:10:37.750474	2026-07-21 16:11:58.755153	\N
21	37	350000	bank_transfer	\N	expired	\N	VND	TVL0000377E2149	sepay	\N	6511223344	TVL0000377E2149	\N	2026-06-29 20:59:14.64283	2026-06-29 20:44:14.64283	2026-06-30 00:37:31.031646	\N
22	38	1779000	bank_transfer	\N	expired	\N	VND	TVL000038FA1676	sepay	\N	6511223344	TVL000038FA1676	\N	2026-06-29 21:26:33.693501	2026-06-29 21:11:33.693501	2026-06-30 00:37:31.031646	\N
23	39	3646540	bank_transfer	\N	expired	\N	VND	TVL0000396D7F49	sepay	\N	6511223344	TVL0000396D7F49	\N	2026-06-29 21:28:07.393342	2026-06-29 21:13:07.393342	2026-06-30 00:37:31.031646	\N
24	40	1656000	bank_transfer	\N	expired	\N	VND	TVL00004044C7AB	sepay	\N	6511223344	TVL00004044C7AB	\N	2026-06-29 21:28:57.778141	2026-06-29 21:13:57.778141	2026-06-30 00:37:31.031646	\N
26	42	1250000	bank_transfer	\N	expired	\N	VND	TVL0000426BD784	sepay	\N	6511223344	TVL0000426BD784	\N	2026-06-29 21:45:35.230871	2026-06-29 21:30:35.230871	2026-06-30 00:37:31.031646	\N
28	44	600000	bank_transfer	\N	expired	\N	VND	TVL000044DDB305	sepay	\N	6511223344	TVL000044DDB305	\N	2026-06-29 23:29:19.897008	2026-06-29 23:14:19.897008	2026-06-30 00:37:31.031646	\N
30	46	850000	bank_transfer	\N	expired	\N	VND	TVL000046692CF2	sepay	\N	6511223344	TVL000046692CF2	\N	2026-06-30 00:32:38.680993	2026-06-30 00:17:38.680993	2026-06-30 00:37:31.031646	\N
31	47	2040000	bank_transfer	\N	expired	\N	VND	TVL000047B98C4D	sepay	\N	6511223344	TVL000047B98C4D	\N	2026-06-30 00:56:20.419141	2026-06-30 00:41:20.419141	2026-06-30 00:56:44.025246	\N
32	48	600000	bank_transfer	\N	expired	\N	VND	TVL0000483E84C1	sepay	\N	6511223344	TVL0000483E84C1	\N	2026-06-30 01:02:12.140007	2026-06-30 00:58:12.140007	2026-06-30 01:02:15.468519	\N
33	50	600000	bank_transfer	\N	paid	FT26181060321015	VND	TVL00005088303B	sepay	65804297	6511223344	TVL00005088303B I21A8U5Q/775811	2026-06-30 16:15:00	2026-06-30 16:28:15.624381	2026-06-30 16:13:15.624381	2026-06-30 16:15:50.336273	\N
35	53	2037086	bank_transfer	\N	paid	FT26181254388808	VND	TVL0000533DE750	sepay	65805714	6511223344	TVL0000533DE750 I21AF22H/848998	2026-06-30 16:24:00	2026-06-30 16:38:48.743624	2026-06-30 16:23:48.743624	2026-06-30 16:24:15.188828	\N
34	51	1250000	bank_transfer	\N	expired	\N	VND	TVL0000510F6218	sepay	\N	6511223344	TVL0000510F6218	\N	2026-06-30 16:36:56.942869	2026-06-30 16:21:56.942869	2026-06-30 16:37:12.38838	\N
36	56	1250000	bank_transfer	\N	paid	FT26183848005605	VND	TVL0000569D3387	sepay	66040243	6511223344	TVL0000569D3387 I2113JXY/201275	2026-07-01 23:01:00	2026-07-01 23:16:07.210284	2026-07-01 23:01:07.210284	2026-07-01 23:01:27.063091	\N
37	61	712000	bank_transfer	\N	expired	\N	VND	TVL000061EE72CD	sepay	\N	6511223344	TVL000061EE72CD	\N	2026-07-02 14:58:09.08958	2026-07-02 14:43:09.08958	2026-07-02 15:27:02.234886	\N
38	63	946025	bank_transfer	\N	paid	FT26201384209681	VND	TVL00006330B5CF	sepay	69024120	6511223344	138427350059-TVL00006330B5CF-CHUYEN TIEN-OQCH000G2Sqd-MOMO138427350059MOMO	2026-07-19 22:28:00	2026-07-19 22:39:12.893836	2026-07-19 22:24:12.893836	2026-07-19 22:28:46.491227	\N
39	65	350000	bank_transfer	\N	refunded	123456	VND	TVL000065542064	sepay	69097948	6511223344	TVL000065542064	2026-07-20 13:47:00	2026-07-20 14:01:50.764635	2026-07-20 13:46:50.764635	2026-07-20 13:51:48.315447	\N
40	66	350000	bank_transfer	\N	paid	FT26201843237011	VND	TVL000066D4B2A0	sepay	69099778	6511223344	TVL000066D4B2A0	2026-07-20 14:01:00	2026-07-20 14:16:16.039618	2026-07-20 14:01:16.039618	2026-07-20 14:01:34.272577	\N
41	67	350000	bank_transfer	\N	paid	FT26201800228016	VND	TVL00006715BC1D	sepay	69100292	6511223344	IBFT TVL00006715BC1D H2C1LSQN/901129	2026-07-20 14:05:00	2026-07-20 14:19:55.703875	2026-07-20 14:04:55.703875	2026-07-20 14:05:38.67893	\N
130	160	1161000	bank_transfer	\N	paid	FT262210000000	VND	TVLVN001	sepay	\N	\N	TVLVN001	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
131	161	1310000	bank_transfer	\N	paid	FT262210007919	VND	TVLVN002	sepay	\N	\N	TVLVN002	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
132	162	3390000	bank_transfer	\N	pending	\N	VND	TVLVN003	sepay	\N	\N	TVLVN003	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
133	163	4390000	bank_transfer	\N	expired	\N	VND	TVLVN004	sepay	\N	\N	TVLVN004	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
134	164	1640000	bank_transfer	\N	pending	\N	VND	TVLVN005	sepay	\N	\N	TVLVN005	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
135	165	8370000	bank_transfer	\N	pending	\N	VND	TVLVN006	sepay	\N	\N	TVLVN006	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
136	166	801000	bank_transfer	\N	paid	FT262210047514	VND	TVLVN007	sepay	\N	\N	TVLVN007	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
137	167	1440000	bank_transfer	\N	paid	FT262210055433	VND	TVLVN008	sepay	\N	\N	TVLVN008	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
138	168	3770000	bank_transfer	\N	pending	\N	VND	TVLVN009	sepay	\N	\N	TVLVN009	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
139	169	1701000	bank_transfer	\N	expired	\N	VND	TVLVN010	sepay	\N	\N	TVLVN010	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
140	170	12180000	bank_transfer	\N	pending	\N	VND	TVLVN011	sepay	\N	\N	TVLVN011	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
141	171	7670000	bank_transfer	\N	pending	\N	VND	TVLVN012	sepay	\N	\N	TVLVN012	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
142	172	2601000	bank_transfer	\N	paid	FT262210095028	VND	TVLVN013	sepay	\N	\N	TVLVN013	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
143	173	31980000	bank_transfer	\N	paid	FT262210102947	VND	TVLVN014	sepay	\N	\N	TVLVN014	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
144	174	92700000	bank_transfer	\N	pending	\N	VND	TVLVN015	sepay	\N	\N	TVLVN015	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
145	175	1161000	bank_transfer	\N	expired	\N	VND	TVLVN016	sepay	\N	\N	TVLVN016	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
146	176	1310000	bank_transfer	\N	pending	\N	VND	TVLVN017	sepay	\N	\N	TVLVN017	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
147	177	3390000	bank_transfer	\N	pending	\N	VND	TVLVN018	sepay	\N	\N	TVLVN018	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
148	178	4390000	bank_transfer	\N	paid	FT262210142542	VND	TVLVN019	sepay	\N	\N	TVLVN019	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
149	179	1640000	bank_transfer	\N	paid	FT262210150461	VND	TVLVN020	sepay	\N	\N	TVLVN020	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
150	180	8370000	bank_transfer	\N	pending	\N	VND	TVLVN021	sepay	\N	\N	TVLVN021	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
151	181	801000	bank_transfer	\N	expired	\N	VND	TVLVN022	sepay	\N	\N	TVLVN022	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
152	182	1440000	bank_transfer	\N	pending	\N	VND	TVLVN023	sepay	\N	\N	TVLVN023	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
153	183	3770000	bank_transfer	\N	pending	\N	VND	TVLVN024	sepay	\N	\N	TVLVN024	\N	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
154	184	1701000	bank_transfer	\N	paid	FT262210190056	VND	TVLVN025	sepay	\N	\N	TVLVN025	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
155	185	12180000	bank_transfer	\N	paid	FT262210197975	VND	TVLVN026	sepay	\N	\N	TVLVN026	2026-07-21 00:15:54.274445	2026-07-24 00:15:54.274445	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
\.


--
-- Data for Name: refund_request; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refund_request (refund_request_id, booking_id, payment_id, requested_by, reason, refund_amount, status, staff_note, completed_by, completed_at, created_at, updated_at, reviewed_by, reviewed_at) FROM stdin;
1	31	15	57	\N	3000.00	completed	lkjhg	2	2026-06-29 18:04:38.898635	2026-06-29 17:02:49.832827	2026-06-29 18:04:38.898635	2	2026-06-29 18:02:51.497917
2	32	16	57	bị bệnh	3000.00	completed	1485	2	2026-06-29 18:39:14.872021	2026-06-29 18:37:57.279972	2026-06-29 18:39:14.872021	2	2026-06-29 18:39:01.865707
4	34	18	57	hủy	3000.00	rejected	\N	\N	\N	2026-06-29 18:58:44.542474	2026-06-29 19:25:24.005853	2	2026-06-29 19:25:24.005853
5	34	18	57	test	3000.00	rejected	\N	\N	\N	2026-06-29 19:25:57.780972	2026-06-29 19:26:18.936126	2	2026-06-29 19:26:18.936126
7	34	18	57	b n	3000.00	pending	\N	\N	\N	2026-06-29 20:05:00.228502	2026-06-29 20:05:00.228502	\N	\N
6	35	19	57	FGNFG	10000.00	completed	48\n8435	2	2026-06-29 20:06:48.378527	2026-06-29 19:48:15.242993	2026-06-29 20:06:48.378527	2	2026-06-29 20:06:06.608277
8	41	25	57	FDSHH	3000.00	rejected	VCN	\N	\N	2026-06-29 21:15:27.58863	2026-06-29 21:28:49.024266	2	2026-06-29 21:28:49.024266
9	41	25	57	Cancel BK-41. Paid bookings will create a manual refund request for staff to process.	3000.00	completed	Request #9 for booking BK-41.	2	2026-06-29 21:30:03.149202	2026-06-29 21:29:14.379982	2026-06-29 21:30:03.149202	2	2026-06-29 21:29:34.968365
10	53	35	58	test	2914.00	rejected	sdgsdg	\N	\N	2026-07-01 22:45:03.05234	2026-07-01 22:46:00.983694	51	2026-07-01 22:46:00.983694
11	56	36	58	nghèo hết tiền	3532.00	approved	Approve Refund Request	\N	\N	2026-07-02 14:51:50.042985	2026-07-02 14:53:43.9381	2	2026-07-02 14:53:43.9381
12	65	39	57	không đi nữa	3000.00	rejected	...	\N	\N	2026-07-20 13:49:35.636253	2026-07-20 13:50:23.376877	4	2026-07-20 13:50:23.376877
13	65	39	57	sdfg	3000.00	completed	qưerty	4	2026-07-20 13:51:48.315447	2026-07-20 13:50:56.711069	2026-07-20 13:51:48.315447	4	2026-07-20 13:51:17.844299
14	70	43	58	\N	3000.00	pending	\N	\N	\N	2026-07-21 15:58:11.016816	2026-07-21 15:58:11.016816	\N	\N
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review (review_id, user_id, location_id, rating, comment, images, date_created, status, created_at, updated_at, deleted_at, booking_id, tour_id) FROM stdin;
1	2	1	5	Không gian trang trọng, nhiều tư liệu lịch sử và rất đáng dành thời gian tham quan.	\N	2026-05-27	approved	2026-05-27 15:18:56.960026	2026-05-27 15:18:56.960026	\N	\N	\N
2	50	5	4	Khung cảnh bên sông thoáng mát, phù hợp để tham quan và chụp ảnh vào buổi chiều.	\N	2026-06-23	pending	2026-06-23 21:38:57.847343	2026-06-23 21:38:57.847343	\N	\N	\N
3	50	4	4	Khuôn viên hiện đại, sạch sẽ và có nhiều góc kiến trúc đẹp.	\N	2026-06-23	approved	2026-06-23 22:10:44.948214	2026-06-23 22:10:44.948214	\N	\N	\N
4	55	7	4	Phần giới thiệu campus khá đầy đủ, nhân viên hỗ trợ nhiệt tình.	\N	2026-07-02	approved	2026-07-02 22:25:11.192441	2026-07-02 22:44:02.887944	2026-07-02 22:44:02.887944	\N	\N
5	55	7	4	Không gian rộng rãi, dễ tham quan và có nhiều thông tin hữu ích cho học sinh.	\N	2026-07-02	approved	2026-07-02 22:46:05.841645	2026-07-02 22:46:08.749957	2026-07-02 22:46:08.749957	\N	\N
6	55	\N	5	Lịch trình hợp lý, hướng dẫn viên thân thiện và giới thiệu rất dễ hiểu.	\N	2026-07-02	approved	2026-07-02 23:19:01.859102	2026-07-02 23:19:16.703514	2026-07-02 23:19:16.703514	62	6
7	55	\N	5	Tour tổ chức chu đáo, điểm tham quan thú vị và đúng với mô tả.	\N	2026-07-02	rejected	2026-07-02 23:25:03.327259	2026-07-02 23:25:03.327259	\N	62	6
8	58	8	5	Tòa nhà hiện đại, sạch sẽ và không gian học tập rất thoáng.	\N	2026-07-20	approved	2026-07-20 20:16:26.221441	2026-07-20 20:16:26.221441	\N	\N	\N
9	58	\N	5	Chuyến đi nhiều thông tin bổ ích, thời gian di chuyển được sắp xếp hợp lý.	\N	2026-07-21	approved	2026-07-21 01:49:51.041638	2026-07-21 02:01:43.604712	\N	60	2
10	58	\N	5	Trải nghiệm miền Tây vui, đồ ăn ngon và các hoạt động rất phù hợp nhóm bạn.	\N	2026-07-21	approved	2026-07-21 02:03:29.943244	2026-07-21 02:03:29.943244	\N	53	4
19	1	57	5	Không gian ven sông thoáng mát, buổi tối lên đèn rất đẹp.	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	2026-07-22	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N	\N
20	3	59	4	Nhiều thông tin thú vị, hướng dẫn tham quan rõ ràng.	https://images.unsplash.com/photo-1570366583862-f91883984fde?auto=format&fit=crop&w=1600&q=85	2026-07-22	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N	\N
21	5	61	5	Kiến trúc được giữ gìn tốt và khuôn viên rất yên tĩnh.	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	2026-07-22	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N	\N
22	10	63	5	Chánh điện trang nghiêm, cảnh quan sạch và thanh bình.	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	2026-07-22	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N	\N
23	11	65	4	Vườn cây xanh mát, chủ vườn thân thiện và nhiệt tình.	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	2026-07-22	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N	\N
24	1	66	5	Trải nghiệm làm bánh vui, phù hợp cho gia đình có trẻ nhỏ.	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	2026-07-22	approved	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	\N	\N
85	1	127	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
86	3	128	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
87	5	129	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
88	10	130	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
89	11	131	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
90	50	132	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
91	55	133	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
92	56	134	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
93	57	135	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
94	58	136	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
95	59	137	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
96	60	138	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
97	61	139	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
98	62	140	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
99	63	141	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
100	1	142	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
101	3	143	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
102	5	144	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
103	10	145	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
104	11	146	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
105	50	147	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
106	55	148	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
107	56	149	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
108	57	150	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
109	58	151	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
110	59	152	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
111	60	153	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
112	61	154	5	Không gian đẹp, thông tin hướng dẫn rõ ràng và nhân viên thân thiện.	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
113	62	155	4	Điểm tham quan được giữ gìn tốt, phù hợp cho cả gia đình.	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
114	63	156	4	Trải nghiệm đáng nhớ, mình sẽ giới thiệu cho bạn bè.	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	2026-07-22	approved	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	\N	\N
\.


--
-- Data for Name: review_photo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.review_photo (photo_id, review_id, photo_url, original_name, mime_type, file_size, created_at, deleted_at) FROM stdin;
1	1	/public/reviews/1779895714183-screenshot_1773716998.png	screenshot_1773716998.png	image/png	247365	2026-05-27 15:28:34.410547	\N
\.


--
-- Data for Name: revoked_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.revoked_tokens (revoked_token_id, token_hash, user_id, expires_at, revoked_at) FROM stdin;
1	a7018548c2f1117f042818f25d3e4d995563a35ef0a32987945138362838512b	4	2026-06-03 13:46:06	2026-05-27 06:46:28.447271
\.


--
-- Data for Name: saved_destination; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_destination (user_id, destination_id, created_at) FROM stdin;
51	8	2026-07-01 15:35:35.654973+07
2	8	2026-07-19 23:51:33.001582+07
2	7	2026-07-20 16:25:39.153566+07
58	8	2026-07-21 03:04:10.212904+07
\.


--
-- Data for Name: saved_tour; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.saved_tour (user_id, tour_id, created_at) FROM stdin;
59	6	2026-07-18 23:26:17.966467+07
\.


--
-- Data for Name: sepay_webhook_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sepay_webhook_log (sepay_webhook_log_id, sepay_transaction_id, payment_id, payment_code, transfer_amount, transfer_type, raw_payload, status, message, created_at) FROM stdin;
1	61401120	2	TVL00000798EB92	8500	in	{"id": 61401120, "code": "TVL00000798EB92", "content": "131564661280-TVL00000798EB92-CHUYEN TIEN-OQCH000Ch0ia-MOMO131564661280MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 131564661280-TVL00000798EB92-CHUYEN TIEN-OQCH000Ch0ia-MOMO131564661280MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26152540980426", "transferAmount": 8500, "transactionDate": "2026-06-01 17:16:00"}	processed	Payment marked as paid	2026-06-01 10:24:20.916449
5	61551766	3	TVL0000084AE6AC	5950	in	{"id": 61551766, "code": "TVL0000084AE6AC", "content": "131711831923-TVL0000084AE6AC-CHUYEN TIEN-OQCH000Cknap-MOMO131711831923MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 131711831923-TVL0000084AE6AC-CHUYEN TIEN-OQCH000Cknap-MOMO131711831923MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26153909675060", "transferAmount": 5950, "transactionDate": "2026-06-02 17:35:00"}	processed	Payment marked as paid	2026-06-02 10:35:08.745956
6	61595096	5	TVL00001034C584	2000	in	{"id": 61595096, "code": "TVL00001034C584", "content": "131753592440-TVL00001034C584-CHUYEN TIEN-OQCH000Cm3pW-MOMO131753592440MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 131753592440-TVL00001034C584-CHUYEN TIEN-OQCH000Cm3pW-MOMO131753592440MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26154072156190", "transferAmount": 2000, "transactionDate": "2026-06-02 22:37:00"}	processed	Payment marked as paid	2026-06-02 15:37:29.915624
7	64902587	7	TVL000019FF0F1B	3000	in	{"id": 64902587, "code": "TVL000019FF0F1B", "content": "134805249220-TVL000019FF0F1B-CHUYEN TIEN-OQCH000EGDZN-MOMO134805249220MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 134805249220-TVL000019FF0F1B-CHUYEN TIEN-OQCH000EGDZN-MOMO134805249220MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26176508048684", "transferAmount": 3000, "transactionDate": "2026-06-25 01:47:00"}	processed	Payment marked as paid	2026-06-24 18:47:41.490357
8	64903150	9	TVL0000210F6C27	3532	in	{"id": 64903150, "code": "TVL0000210F6C27", "content": "134805696590-TVL0000210F6C27-CHUYEN TIEN-OQCH000EGE66-MOMO134805696590MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 134805696590-TVL0000210F6C27-CHUYEN TIEN-OQCH000EGE66-MOMO134805696590MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26176098407160", "transferAmount": 3532, "transactionDate": "2026-06-25 01:56:00"}	processed	Payment marked as paid	2026-06-24 18:56:54.744645
9	65364513	10	TVL000022FE9595	3000	in	{"id": 65364513, "code": "TVL000022FE9595", "content": "135166597124-TVL000022FE9595-CHUYEN TIEN-OQCH000ERr3O-MOMO135166597124MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135166597124-TVL000022FE9595-CHUYEN TIEN-OQCH000ERr3O-MOMO135166597124MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26178208683147", "transferAmount": 3000, "transactionDate": "2026-06-27 19:51:00"}	processed	Payment marked as paid	2026-06-27 12:51:13.909989
10	65366122	11	TVL000023C630B5	3000	in	{"id": 65366122, "code": "TVL000023C630B5", "content": "135167887857-TVL000023C630B5-CHUYEN TIEN-OQCH000ERuGy-MOMO135167887857MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135167887857-TVL000023C630B5-CHUYEN TIEN-OQCH000ERuGy-MOMO135167887857MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26178950257184", "transferAmount": 3000, "transactionDate": "2026-06-27 20:01:00"}	processed	Payment marked as paid	2026-06-27 13:01:50.084087
11	65368917	12	TVL00002460ECA7	3532	in	{"id": 65368917, "code": "TVL00002460ECA7", "content": "135170335687-TVL00002460ECA7-CHUYEN TIEN-OQCH000ERzbk-MOMO135170335687MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135170335687-TVL00002460ECA7-CHUYEN TIEN-OQCH000ERzbk-MOMO135170335687MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26178737117222", "transferAmount": 3532, "transactionDate": "2026-06-27 20:19:00"}	processed	Payment marked as paid	2026-06-27 13:19:10.433041
12	65626271	13	TVL00002529220F	2500	in	{"id": 65626271, "code": "TVL00002529220F", "content": "135384837172-TVL00002529220F-CHUYEN TIEN-OQCH000EYldB-MOMO135384837172MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135384837172-TVL00002529220F-CHUYEN TIEN-OQCH000EYldB-MOMO135384837172MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180400499706", "transferAmount": 2500, "transactionDate": "2026-06-29 14:34:00"}	processed	Payment marked as paid	2026-06-29 14:34:37.762009
13	65639908	14	TVL0000302D7B72	250000	in	{"id": 65639908, "code": "TVL0000302D7B72", "content": "135394590777-TVL0000302D7B72-CHUYEN TIEN-OQCH000EZ4IZ-MOMO135394590777MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135394590777-TVL0000302D7B72-CHUYEN TIEN-OQCH000EZ4IZ-MOMO135394590777MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180894729489", "transferAmount": 250000, "transactionDate": "2026-06-29 16:09:00"}	ignored	Payment status is expired	2026-06-29 16:09:28.342889
14	65648744	15	TVL000031FE8983	3000	in	{"id": 65648744, "code": "TVL000031FE8983", "content": "135400463963-TVL000031FE8983-CHUYEN TIEN-OQCH000EZGmC-MOMO135400463963MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135400463963-TVL000031FE8983-CHUYEN TIEN-OQCH000EZGmC-MOMO135400463963MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180073593678", "transferAmount": 3000, "transactionDate": "2026-06-29 17:01:00"}	processed	Payment marked as paid	2026-06-29 17:01:35.896574
15	65662559	16	TVL000032F241B1	3000	in	{"id": 65662559, "code": "TVL000032F241B1", "content": "135410719789-TVL000032F241B1-CHUYEN TIEN-OQCH000EZXiM-MOMO135410719789MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135410719789-TVL000032F241B1-CHUYEN TIEN-OQCH000EZXiM-MOMO135410719789MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180328297341", "transferAmount": 3000, "transactionDate": "2026-06-29 18:11:00"}	processed	Payment marked as paid	2026-06-29 18:11:10.924087
16	65667809	\N	TVL0000331DFC34	3000	in	{"id": 65667809, "code": "TVL0000331DFC34", "content": "135415248306-TVL0000331DFC34-CHUYEN TIEN-OQCH000EZh38-MOMO135415248306MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135415248306-TVL0000331DFC34-CHUYEN TIEN-OQCH000EZh38-MOMO135415248306MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180574034147", "transferAmount": 3000, "transactionDate": "2026-06-29 18:41:00"}	processed	Payment marked as paid	2026-06-29 18:41:51.769686
17	65670623	18	TVL0000347D0E61	3000	in	{"id": 65670623, "code": "TVL0000347D0E61", "content": "135417759773-TVL0000347D0E61-CHUYEN TIEN-OQCH000EZm2t-MOMO135417759773MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135417759773-TVL0000347D0E61-CHUYEN TIEN-OQCH000EZm2t-MOMO135417759773MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180570650167", "transferAmount": 3000, "transactionDate": "2026-06-29 18:58:00"}	processed	Payment marked as paid	2026-06-29 18:58:14.586359
18	65678882	19	TVL0000357CFDBC	10000	in	{"id": 65678882, "code": "TVL0000357CFDBC", "content": "135424628153-TVL0000357CFDBC-CHUYEN TIEN-OQCH000Ea0Q5-MOMO135424628153MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135424628153-TVL0000357CFDBC-CHUYEN TIEN-OQCH000Ea0Q5-MOMO135424628153MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180303940647", "transferAmount": 10000, "transactionDate": "2026-06-29 19:47:00"}	processed	Payment marked as paid	2026-06-29 19:47:38.576706
19	65692984	25	TVL000041B61503	3000	in	{"id": 65692984, "code": "TVL000041B61503", "content": "135435633154-TVL000041B61503-CHUYEN TIEN-OQCH000EaNHG-MOMO135435633154MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135435633154-TVL000041B61503-CHUYEN TIEN-OQCH000EaNHG-MOMO135435633154MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26180942802700", "transferAmount": 3000, "transactionDate": "2026-06-29 21:14:00"}	processed	Payment marked as paid	2026-06-29 21:14:45.601194
20	65707025	27	TVL00004357445B	6000	in	{"id": 65707025, "code": "TVL00004357445B", "content": "135445921323-TVL00004357445B-CHUYEN TIEN-OQCH000EakVL-MOMO135445921323MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135445921323-TVL00004357445B-CHUYEN TIEN-OQCH000EakVL-MOMO135445921323MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181892263970", "transferAmount": 6000, "transactionDate": "2026-06-29 23:10:00"}	processed	Payment marked as paid	2026-06-29 23:10:08.328083
21	65713026	29	TVL000045E40657	2475	in	{"id": 65713026, "code": "TVL000045E40657", "content": "135449819136-TVL000045E40657-CHUYEN TIEN-OQCH000EarN8-MOMO135449819136MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 135449819136-TVL000045E40657-CHUYEN TIEN-OQCH000EarN8-MOMO135449819136MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181866104884", "transferAmount": 2475, "transactionDate": "2026-06-30 00:16:00"}	processed	Payment marked as paid	2026-06-30 00:16:07.849359
22	65804297	33	TVL00005088303B	4950	in	{"id": 65804297, "code": "TVL00005088303B", "content": "TVL00005088303B I21A8U5Q/775811", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL00005088303B I21A8U5Q/775811", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181060321015", "transferAmount": 4950, "transactionDate": "2026-06-30 16:15:00"}	processed	Payment marked as paid	2026-06-30 16:15:50.336273
23	65805714	35	TVL0000533DE750	2914	in	{"id": 65805714, "code": "TVL0000533DE750", "content": "TVL0000533DE750 I21AF22H/848998", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL0000533DE750 I21AF22H/848998", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26181254388808", "transferAmount": 2914, "transactionDate": "2026-06-30 16:24:00"}	processed	Payment marked as paid	2026-06-30 16:24:15.188828
24	66040243	36	TVL0000569D3387	3532	in	{"id": 66040243, "code": "TVL0000569D3387", "content": "TVL0000569D3387 I2113JXY/201275", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL0000569D3387 I2113JXY/201275", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26183848005605", "transferAmount": 3532, "transactionDate": "2026-07-01 23:01:00"}	processed	Payment marked as paid	2026-07-01 23:01:27.063091
25	69024120	38	TVL00006330B5CF	3975	in	{"id": 69024120, "code": "TVL00006330B5CF", "content": "138427350059-TVL00006330B5CF-CHUYEN TIEN-OQCH000G2Sqd-MOMO138427350059MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138427350059-TVL00006330B5CF-CHUYEN TIEN-OQCH000G2Sqd-MOMO138427350059MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201384209681", "transferAmount": 3975, "transactionDate": "2026-07-19 22:28:00"}	processed	Payment marked as paid	2026-07-19 22:28:46.491227
26	69097948	39	TVL000065542064	3000	in	{"id": 69097948, "code": "TVL000065542064", "content": "TVL000065542064", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL000065542064", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201176414690", "transferAmount": 3000, "transactionDate": "2026-07-20 13:47:00"}	processed	Payment marked as paid	2026-07-20 13:47:08.160023
27	69099778	40	TVL000066D4B2A0	3000	in	{"id": 69099778, "code": "TVL000066D4B2A0", "content": "TVL000066D4B2A0", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify TVL000066D4B2A0", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201843237011", "transferAmount": 3000, "transactionDate": "2026-07-20 14:01:00"}	processed	Payment marked as paid	2026-07-20 14:01:34.272577
28	69100292	41	TVL00006715BC1D	2000	in	{"id": 69100292, "code": "TVL00006715BC1D", "content": "IBFT TVL00006715BC1D H2C1LSQN/901129", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify IBFT TVL00006715BC1D H2C1LSQN/901129", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201800228016", "transferAmount": 2000, "transactionDate": "2026-07-20 14:05:00"}	processed	Payment marked as paid	2026-07-20 14:05:38.67893
29	69120531	42	TVL0000688DD813	3000	in	{"id": 69120531, "code": "TVL0000688DD813", "content": "138523640262-TVL0000688DD813-CHUYEN TIEN-OQCH000G5BZb-MOMO138523640262MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138523640262-TVL0000688DD813-CHUYEN TIEN-OQCH000G5BZb-MOMO138523640262MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26201099229076", "transferAmount": 3000, "transactionDate": "2026-07-20 16:23:00"}	processed	Payment marked as paid	2026-07-20 16:23:10.337519
30	69198764	43	TVL00007079682D	3000	in	{"id": 69198764, "code": "TVL00007079682D", "content": "138585775815-TVL00007079682D-CHUYEN TIEN-OQCH000G7Ld0-MOMO138585775815MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138585775815-TVL00007079682D-CHUYEN TIEN-OQCH000G7Ld0-MOMO138585775815MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26202911719227", "transferAmount": 3000, "transactionDate": "2026-07-21 01:32:00"}	processed	Payment marked as paid	2026-07-21 01:33:01.161866
31	69198929	45	TVL000072C4035C	3000	in	{"id": 69198929, "code": "TVL000072C4035C", "content": "138585960663-TVL000072C4035C-CHUYEN TIEN-OQCH000G7M0D-MOMO138585960663MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138585960663-TVL000072C4035C-CHUYEN TIEN-OQCH000G7M0D-MOMO138585960663MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26202087091790", "transferAmount": 3000, "transactionDate": "2026-07-21 01:39:00"}	processed	Payment marked as paid	2026-07-21 01:39:03.75847
32	69283270	47	TVL00007453AA56	3000	in	{"id": 69283270, "code": "TVL00007453AA56", "content": "138663026258-TVL00007453AA56-CHUYEN TIEN-OQCH000G9VNp-MOMO138663026258MOMO", "gateway": "MBBank", "subAccount": null, "accumulated": 0, "description": "BankAPINotify 138663026258-TVL00007453AA56-CHUYEN TIEN-OQCH000G9VNp-MOMO138663026258MOMO", "transferType": "in", "accountNumber": "6511223344", "referenceCode": "FT26202631760083", "transferAmount": 3000, "transactionDate": "2026-07-21 16:11:00"}	processed	Payment marked as paid	2026-07-21 16:11:58.755153
\.


--
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.statistics (stat_id, type, data, created_at) FROM stdin;
\.


--
-- Data for Name: tour; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tour (tour_id, name, description, price, schedule, capacity, tour_category_id, status, created_at, updated_at, thumbnail, deleted_at, start_at, child_price, slug, short_description, duration_days, duration_nights, start_time, end_time, tour_type, languages, difficulty, minimum_participants, minimum_booking, maximum_booking, meeting_point, pickup_available, pickup_description, highlights, inclusions, exclusions, requirements, cancellation_policy, booking_policy, additional_information, faqs, video_url, gallery, currency, infant_price) FROM stdin;
1	Dinh Độc Lập và Dấu Ấn Sài Gòn	Hành trình nửa ngày khám phá Dinh Độc Lập cùng những câu chuyện lịch sử và kiến trúc tiêu biểu của Sài Gòn.	690000	08:00 – 12:00	25	4	active	2026-05-27 14:01:13.658986	2026-07-21 20:06:52.478459	https://s3.cloudfly.vn/travellens/tours/1782282834284-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	\N	\N	450000.00	dinh-doc-lap-va-dau-an-sai-gon	Tour nửa ngày khám phá lịch sử và kiến trúc Dinh Độc Lập.	1	0	08:00:00	17:00:00	group	["vi"]	easy	1	1	\N	Cổng chính Dinh Độc Lập, 135 Nam Kỳ Khởi Nghĩa, Quận 1	f		[]	[]	[]	[]	\N	\N	\N	[]		[]	VND	0.00
2	Sài Gòn Xưa: Dinh Độc Lập và Bến Nhà Rồng	Tour một ngày kết nối hai địa danh lịch sử nổi bật, kết hợp tham quan, nghe thuyết minh và trải nghiệm cảnh quan ven sông Sài Gòn.	890000	08:00 – 17:00	30	4	active	2026-06-02 16:00:39.523557	2026-06-23 18:29:41.041535	https://s3.cloudfly.vn/travellens/tours/1781797468791-Screenshot-2025-03-11-212405.png	\N	\N	590000.00	sai-gon-xua-dinh-doc-lap-ben-nha-rong	Một ngày khám phá hai biểu tượng lịch sử của Thành phố Hồ Chí Minh.	1	0	\N	\N	group	[]	easy	1	1	\N	Nhà Văn hóa Thanh Niên, Quận 1	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
3	Ký Ức Sài Gòn	Hành trình tham quan các dấu ấn lịch sử và không gian văn hóa đặc trưng của Sài Gòn.	790000	08:30 – 16:30	20	\N	deleted	2026-06-18 15:55:00.294418	2026-06-18 16:06:17.088777	\N	2026-06-18 16:06:17.088777	\N	520000.00	ky-uc-sai-gon	Khám phá những câu chuyện và dấu ấn đáng nhớ của Sài Gòn.	1	0	\N	\N	group	[]	easy	1	1	\N	Bưu điện Trung tâm Sài Gòn	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
4	Miền Tây Xanh – Trải Nghiệm Ông Đề	Một ngày hòa mình vào không gian miệt vườn Cần Thơ, tham gia trò chơi dân gian và thưởng thức ẩm thực miền Tây.	1250000	07:30 – 17:30	35	4	active	2026-06-18 16:13:34.620645	2026-06-23 20:33:50.622119	\N	\N	\N	790000.00	mien-tay-xanh-trai-nghiem-ong-de	Trải nghiệm sinh thái, trò chơi dân gian và ẩm thực Cần Thơ.	1	0	\N	\N	group	[]	easy	1	1	\N	Bến Ninh Kiều, Cần Thơ	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
5	Về Miền Tây Tuổi Thơ	Chuyến đi dành cho gia đình với các hoạt động làm bánh dân gian, thăm vườn cây và vui chơi ngoài trời.	1090000	08:00 – 17:00	28	4	deleted	2026-06-18 16:21:35.454433	2026-06-24 07:01:54.681373	https://s3.cloudfly.vn/travellens/tours/1782284487277-Screenshot-2026-03-24-200329.png	2026-06-24 07:01:54.681373	\N	690000.00	ve-mien-tay-tuoi-tho	Tour gia đình trải nghiệm nét đẹp tuổi thơ miền sông nước.	1	0	\N	\N	group	[]	easy	1	1	\N	Trung tâm thành phố Cần Thơ	f	\N	[]	[]	[]	[]	\N	\N	\N	[]	\N	[]	VND	0.00
37	Bình Minh Chợ Nổi Cái Răng	Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.	650000	07:30 – 17:30	20	4	active	2026-07-22 00:08:34.293735	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg	\N	2026-08-06 00:08:34.293735	420000.00	binh-minh-cho-noi-cai-rang	Khám phá bình minh chợ nổi cái răng với hướng dẫn viên địa phương.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	20	Bến Ninh Kiều, Cần Thơ	t	\N	["Hướng dẫn viên địa phương", "Nhóm nhỏ", "Trải nghiệm văn hóa bản địa"]	["Xe đưa đón theo lịch trình", "Vé tham quan", "Nước uống", "Hướng dẫn viên"]	["Chi phí cá nhân", "Đồ uống ngoài chương trình"]	["Mang theo giấy tờ tùy thân", "Trang phục thoải mái"]	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.", "question": "Tour có phù hợp với trẻ em không?"}]	\N	[{"alt": "Chợ nổi Cái Răng", "url": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg"}]	VND	0.00
6	Khám Phá Campus FPT Cần Thơ	Tham quan kiến trúc nổi bật, không gian học tập và đời sống sinh viên tại Trường Đại học FPT Cần Thơ.	350000	08:30 – 11:30	30	4	active	2026-06-24 07:17:16.364663	2026-07-20 14:11:40.574524	https://s3.cloudfly.vn/travellens/tours/1782285521014-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	\N	\N	250000.00	kham-pha-campus-fpt-can-tho	Khám phá kiến trúc và môi trường học tập tại FPT Cần Thơ.	1	0	09:00:00	17:00:00	group	["vi"]	easy	1	1	\N	Cổng Trường Đại học FPT Cần Thơ	f		["Highlights 1", "Highlights 2", "Highlight Content 1", "Highlight Content 2"]	["Inclusions 1", "Inclusions 2", "Inclusions Content 2", "Inclusions Content 3"]	["Exclusions 1", "Exclusions 2"]	["Requirements 1", "Requirements 2"]	Cancellation Policy\r\nCancellation Policy\r\nCancellation Policy\r\n	Booking Policy\r\nBooking Policy\r\nBooking Policy\r\n	Additional Information\r\nAdditional Information\r\n	[{"answer": "a s", "faq_id": 1, "question": "a", "order_index": 1}, {"answer": "b s", "faq_id": 2, "question": "b", "order_index": 2}]		[{"alt": "truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg", "url": "https://s3.cloudfly.vn/travellens/media/1782243927782-truong-pho-thong-fpt-can-tho-xet-hoc-ba.jpg", "type": "image", "media_id": 1, "order_index": 1}, {"alt": "PaymentStatusUpdate.drawio.png", "url": "https://s3.cloudfly.vn/travellens/media/1782214382526-PaymentStatusUpdate-drawio.png", "type": "image", "media_id": 2, "order_index": 2}, {"alt": "Delete review.drawio.png", "url": "https://s3.cloudfly.vn/travellens/media/1782214256372-Delete-review-drawio.png", "type": "image", "media_id": 3, "order_index": 3}, {"alt": "The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg", "url": "https://s3.cloudfly.vn/travellens/media/1782205394893-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg", "type": "image", "media_id": 4, "order_index": 4}, {"alt": "Createbookingt.drawio.png", "url": "https://s3.cloudfly.vn/travellens/media/1782124132690-Createbookingt-drawio.png", "type": "image", "media_id": 5, "order_index": 5}]	VND	0.00
36	Cần Thơ Sông Nước và Văn Hóa	Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.	1690000	Theo chương trình từng ngày	24	4	active	2026-07-22 00:08:34.293735	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	\N	2026-08-06 00:08:34.293735	1090000.00	can-tho-song-nuoc-va-van-hoa	Khám phá cần thơ sông nước và văn hóa với hướng dẫn viên địa phương.	2	1	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	24	Bến Ninh Kiều, Cần Thơ	t	\N	["Hướng dẫn viên địa phương", "Nhóm nhỏ", "Trải nghiệm văn hóa bản địa"]	["Xe đưa đón theo lịch trình", "Vé tham quan", "Nước uống", "Hướng dẫn viên"]	["Chi phí cá nhân", "Đồ uống ngoài chương trình"]	["Mang theo giấy tờ tùy thân", "Trang phục thoải mái"]	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.", "question": "Tour có phù hợp với trẻ em không?"}]	\N	[{"alt": "Bến Ninh Kiều", "url": "https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg"}, {"alt": "Chợ nổi Cái Răng", "url": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg"}]	VND	0.00
86	Việt Nam Cao Cấp 10 Ngày	Hành trình việt nam cao cấp 10 ngày được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	38900000	Lịch trình 10 ngày	26	37	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	\N	2026-08-19 00:15:54.274445	26900000.00	viet-nam-cao-cap-10-ngay	Khám phá điểm đến tiêu biểu trong 10 ngày 9 đêm.	10	9	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	26	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Văn Miếu – Quốc Tử Giám", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg"}, {"alt": "Đại Nội Huế", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg"}, {"alt": "Phố cổ Hội An", "url": "https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg"}, {"alt": "Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg"}, {"alt": "Bãi Sao Phú Quốc", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg"}]	VND	0.00
38	Dấu Xưa Bình Thủy	Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.	590000	07:30 – 17:30	18	4	active	2026-07-22 00:08:34.293735	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	\N	2026-08-06 00:08:34.293735	390000.00	dau-xua-binh-thuy	Khám phá dấu xưa bình thủy với hướng dẫn viên địa phương.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	18	Bến Ninh Kiều, Cần Thơ	t	\N	["Hướng dẫn viên địa phương", "Nhóm nhỏ", "Trải nghiệm văn hóa bản địa"]	["Xe đưa đón theo lịch trình", "Vé tham quan", "Nước uống", "Hướng dẫn viên"]	["Chi phí cá nhân", "Đồ uống ngoài chương trình"]	["Mang theo giấy tờ tùy thân", "Trang phục thoải mái"]	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.", "question": "Tour có phù hợp với trẻ em không?"}]	\N	[{"alt": "Nhà cổ Bình Thủy", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg"}]	VND	0.00
39	Cồn Sơn Trải Nghiệm Miệt Vườn	Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.	890000	07:30 – 17:30	25	4	active	2026-07-22 00:08:34.293735	2026-07-22 11:08:29.646509	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	\N	2026-08-06 00:08:34.293735	590000.00	con-son-trai-nghiem-miet-vuon	Khám phá cồn sơn trải nghiệm miệt vườn với hướng dẫn viên địa phương.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	25	Bến Ninh Kiều, Cần Thơ	t	\N	["Hướng dẫn viên địa phương", "Nhóm nhỏ", "Trải nghiệm văn hóa bản địa"]	["Xe đưa đón theo lịch trình", "Vé tham quan", "Nước uống", "Hướng dẫn viên"]	["Chi phí cá nhân", "Đồ uống ngoài chương trình"]	["Mang theo giấy tờ tùy thân", "Trang phục thoải mái"]	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.", "question": "Tour có phù hợp với trẻ em không?"}]	\N	[{"alt": "Cồn Sơn", "url": "https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg"}]	VND	0.00
40	Cần Thơ An Nhiên	Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.	1290000	07:30 – 17:30	22	4	active	2026-07-22 00:08:34.293735	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	\N	2026-08-06 00:08:34.293735	850000.00	can-tho-an-nhien	Khám phá cần thơ an nhiên với hướng dẫn viên địa phương.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	22	Bến Ninh Kiều, Cần Thơ	t	\N	["Hướng dẫn viên địa phương", "Nhóm nhỏ", "Trải nghiệm văn hóa bản địa"]	["Xe đưa đón theo lịch trình", "Vé tham quan", "Nước uống", "Hướng dẫn viên"]	["Chi phí cá nhân", "Đồ uống ngoài chương trình"]	["Mang theo giấy tờ tùy thân", "Trang phục thoải mái"]	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.", "question": "Tour có phù hợp với trẻ em không?"}]	\N	[{"alt": "Thiền viện Trúc Lâm Phương Nam", "url": "https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg"}, {"alt": "Cồn Sơn", "url": "https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg"}]	VND	0.00
41	Hành Trình Cần Thơ Ba Ngày	Hành trình được thiết kế cân bằng giữa tham quan, trải nghiệm văn hóa bản địa và thời gian nghỉ ngơi.	4290000	Theo chương trình từng ngày	20	4	active	2026-07-22 00:08:34.293735	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	\N	2026-08-06 00:08:34.293735	2890000.00	hanh-trinh-can-tho-ba-ngay	Khám phá hành trình cần thơ ba ngày với hướng dẫn viên địa phương.	3	2	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	20	Bến Ninh Kiều, Cần Thơ	t	\N	["Hướng dẫn viên địa phương", "Nhóm nhỏ", "Trải nghiệm văn hóa bản địa"]	["Xe đưa đón theo lịch trình", "Vé tham quan", "Nước uống", "Hướng dẫn viên"]	["Chi phí cá nhân", "Đồ uống ngoài chương trình"]	["Mang theo giấy tờ tùy thân", "Trang phục thoải mái"]	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, lịch trình nhẹ nhàng và có giá riêng cho trẻ em.", "question": "Tour có phù hợp với trẻ em không?"}]	\N	[{"alt": "Bến Ninh Kiều", "url": "https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg"}, {"alt": "Chợ nổi Cái Răng", "url": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg"}, {"alt": "Nhà cổ Bình Thủy", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg"}, {"alt": "Thiền viện Trúc Lâm Phương Nam", "url": "https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg"}, {"alt": "Cồn Sơn", "url": "https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg"}]	VND	0.00
72	Tinh Hoa Hà Nội Một Ngày	Hành trình tinh hoa hà nội một ngày được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	1290000	07:30 – 17:30	18	32	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	\N	2026-08-05 00:15:54.274445	850000.00	tinh-hoa-ha-noi-mot-ngay	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	18	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Văn Miếu – Quốc Tử Giám", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg"}, {"alt": "Hoàng thành Thăng Long", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg"}]	VND	0.00
73	Hoàng Thành và Văn Miếu	Hành trình hoàng thành và văn miếu được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	790000	07:30 – 17:30	22	38	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	\N	2026-08-06 00:15:54.274445	520000.00	hoang-thanh-va-van-mieu	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	22	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Văn Miếu – Quốc Tử Giám", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg"}, {"alt": "Hoàng thành Thăng Long", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg"}]	VND	0.00
74	Di Sản Cố Đô Huế	Hành trình di sản cố đô huế được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	1490000	07:30 – 17:30	26	32	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	\N	2026-08-07 00:15:54.274445	950000.00	di-san-co-do-hue	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	26	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Đại Nội Huế", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg"}, {"alt": "Chùa Thiên Mụ", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg"}]	VND	0.00
75	Huế An Nhiên Ba Ngày	Hành trình huế an nhiên ba ngày được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	4690000	Lịch trình 3 ngày	30	35	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	\N	2026-08-08 00:15:54.274445	3190000.00	hue-an-nhien-ba-ngay	Khám phá điểm đến tiêu biểu trong 3 ngày 2 đêm.	3	2	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	30	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Đại Nội Huế", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg"}, {"alt": "Chùa Thiên Mụ", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg"}]	VND	0.00
76	Hội An Đêm Phố Cổ	Hành trình hội an đêm phố cổ được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	990000	07:30 – 17:30	18	6	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	\N	2026-08-09 00:15:54.274445	650000.00	hoi-an-dem-pho-co	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	18	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Phố cổ Hội An", "url": "https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg"}]	VND	0.00
77	Đà Nẵng Bà Nà và Hội An	Hành trình đà nẵng bà nà và hội an được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	3590000	Lịch trình 3 ngày	22	4	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	\N	2026-08-10 00:15:54.274445	2390000.00	da-nang-ba-na-hoi-an	Khám phá điểm đến tiêu biểu trong 3 ngày 2 đêm.	3	2	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	22	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Phố cổ Hội An", "url": "https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg"}, {"alt": "Bà Nà Hills", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg"}]	VND	0.00
78	Sài Gòn Kiến Trúc và Nghệ Thuật	Hành trình sài gòn kiến trúc và nghệ thuật được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	890000	07:30 – 17:30	26	32	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	\N	2026-08-11 00:15:54.274445	590000.00	sai-gon-kien-truc-nghe-thuat	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	26	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg"}, {"alt": "Nhà hát Thành phố Hồ Chí Minh", "url": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg"}]	VND	0.00
79	Sài Gòn Food Tour Buổi Tối	Hành trình sài gòn food tour buổi tối được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	850000	07:30 – 17:30	30	33	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	\N	2026-08-12 00:15:54.274445	590000.00	sai-gon-food-tour-buoi-toi	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	30	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Chợ Bến Thành", "url": "https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG"}]	VND	0.00
80	Chinh Phục Núi Bà Đen	Hành trình chinh phục núi bà đen được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	1590000	Lịch trình 2 ngày	18	36	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	\N	2026-08-13 00:15:54.274445	1090000.00	chinh-phuc-nui-ba-den	Khám phá điểm đến tiêu biểu trong 2 ngày 1 đêm.	2	1	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	moderate	1	1	18	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Núi Bà Đen", "url": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg"}]	VND	0.00
81	Tràm Chim Mùa Nước Nổi	Hành trình tràm chim mùa nước nổi được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	1890000	Lịch trình 2 ngày	22	34	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	\N	2026-08-14 00:15:54.274445	1250000.00	tram-chim-mua-nuoc-noi	Khám phá điểm đến tiêu biểu trong 2 ngày 1 đêm.	2	1	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	22	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Vườn quốc gia Tràm Chim", "url": "https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg"}]	VND	0.00
82	Phú Quốc Biển Xanh Bốn Ngày	Hành trình phú quốc biển xanh bốn ngày được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	7290000	Lịch trình 4 ngày	26	35	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	\N	2026-08-15 00:15:54.274445	4890000.00	phu-quoc-bien-xanh-bon-ngay	Khám phá điểm đến tiêu biểu trong 4 ngày 3 đêm.	4	3	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	26	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Bãi Sao Phú Quốc", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg"}, {"alt": "Nhà tù Phú Quốc", "url": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG"}, {"alt": "Làng chài Hàm Ninh", "url": "https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg"}]	VND	0.00
83	Hàm Ninh và Bãi Sao Riêng Tư	Hành trình hàm ninh và bãi sao riêng tư được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	3290000	07:30 – 17:30	30	37	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	\N	2026-08-16 00:15:54.274445	2190000.00	ham-ninh-bai-sao-rieng-tu	Khám phá điểm đến tiêu biểu trong 1 ngày 0 đêm.	1	0	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	30	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Bãi Sao Phú Quốc", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg"}, {"alt": "Làng chài Hàm Ninh", "url": "https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg"}]	VND	0.00
84	Cát Tiên Khám Phá Rừng Xanh	Hành trình cát tiên khám phá rừng xanh được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	2890000	Lịch trình 3 ngày	18	36	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	\N	2026-08-17 00:15:54.274445	1890000.00	cat-tien-kham-pha-rung-xanh	Khám phá điểm đến tiêu biểu trong 3 ngày 2 đêm.	3	2	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	moderate	1	1	18	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Vườn quốc gia Cát Tiên", "url": "https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg"}]	VND	0.00
85	Hành Trình Di Sản Việt Nam 8 Ngày	Hành trình hành trình di sản việt nam 8 ngày được xây dựng với lịch trình rõ ràng, dịch vụ đồng bộ và thời gian trải nghiệm hợp lý.	18990000	Lịch trình 8 ngày	22	31	active	2026-07-22 00:15:54.274445	2026-07-22 11:08:29.646509	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	\N	2026-08-18 00:15:54.274445	12990000.00	hanh-trinh-di-san-viet-nam-8-ngay	Khám phá điểm đến tiêu biểu trong 8 ngày 7 đêm.	8	7	07:30:00	17:30:00	group	["Tiếng Việt", "English"]	easy	1	1	22	Điểm đón trung tâm theo xác nhận	t	\N	["Điểm đến chọn lọc", "Hướng dẫn viên chuyên nghiệp", "Trải nghiệm bản địa"]	["Xe đưa đón", "Vé tham quan", "Nước uống", "Bảo hiểm du lịch"]	["Chi phí cá nhân", "Phụ thu phòng đơn"]	["Giấy tờ tùy thân", "Giày đi bộ thoải mái"]	Hoàn 100% khi hủy trước 7 ngày.	Đặt trước tối thiểu 4 giờ.	\N	[{"answer": "Có, vui lòng cung cấp độ tuổi khi đặt tour.", "question": "Có hỗ trợ trẻ em không?"}, {"answer": "Có tại khu vực trung tâm theo lịch xác nhận.", "question": "Có đón tại khách sạn không?"}]	\N	[{"alt": "Văn Miếu – Quốc Tử Giám", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg"}, {"alt": "Hoàng thành Thăng Long", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg"}, {"alt": "Đại Nội Huế", "url": "https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg"}, {"alt": "Chùa Thiên Mụ", "url": "https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg"}, {"alt": "Phố cổ Hội An", "url": "https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg"}, {"alt": "Bà Nà Hills", "url": "https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg"}]	VND	0.00
\.


--
-- Data for Name: tour_category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tour_category (tour_category_id, name, description, created_at, updated_at) FROM stdin;
4	Gia đình	Lịch trình nhẹ nhàng, phù hợp gia đình và trẻ em.	2026-06-19 16:12:27.028995	2026-06-19 16:12:27.028995
6	Cặp đôi	Hành trình riêng tư và lãng mạn dành cho hai người.	2026-06-23 17:51:48.16318	2026-06-23 17:51:48.16318
31	Khám phá	Hành trình đa trải nghiệm, tìm hiểu điểm đến theo cách bản địa.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
32	Văn hóa – Lịch sử	Tour tìm hiểu di sản, kiến trúc và các câu chuyện lịch sử.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
33	Ẩm thực	Khám phá món ngon, chợ địa phương và văn hóa bàn ăn.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
34	Sinh thái	Trải nghiệm thiên nhiên, miệt vườn và du lịch có trách nhiệm.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
35	Nghỉ dưỡng	Lịch trình thư giãn với dịch vụ lưu trú và chăm sóc chất lượng.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
36	Phiêu lưu	Hoạt động ngoài trời dành cho du khách yêu vận động.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
37	Cao cấp	Hành trình riêng với dịch vụ và phương tiện tiêu chuẩn cao.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
38	Trong ngày	Tour ngắn gọn, tối ưu cho quỹ thời gian một ngày.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445
\.


--
-- Data for Name: tour_content_item; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tour_content_item (content_item_id, type, content, status, created_at, updated_at, deleted_at, normalized_content) FROM stdin;
2	requirement	Requirements Content 1	active	2026-07-19 21:00:09.025121	2026-07-19 21:26:03.898368	\N	requirements content 1
7	exclusion	Exclusion Content 1	active	2026-07-20 00:19:03.56738	2026-07-20 00:19:03.56738	\N	exclusion content 1
8	exclusion	Exclusion Content 2	active	2026-07-20 00:19:03.56738	2026-07-20 00:19:03.56738	\N	exclusion content 2
9	exclusion	Exclusion Content 3	active	2026-07-20 00:19:03.56738	2026-07-20 00:19:03.56738	\N	exclusion content 3
3	inclusion	Inclusions Content 1	active	2026-07-19 21:01:18.546453	2026-07-20 00:22:28.491376	\N	inclusions content 1
10	inclusion	Inclusions Content 2	active	2026-07-20 00:22:56.823063	2026-07-20 00:22:56.823063	\N	inclusions content 2
11	highlight	Inclusions Content 3	inactive	2026-07-20 00:23:04.129385	2026-07-20 00:23:15.605105	2026-07-20 00:23:15.605105	inclusions content 3
12	inclusion	Inclusions Content 3	active	2026-07-20 00:23:28.096295	2026-07-20 00:23:28.096295	\N	inclusions content 3
4	highlight	Highlight Content 1	inactive	2026-07-19 21:10:53.993642	2026-07-20 00:24:13.242754	2026-07-20 00:24:13.242754	highlight content 1
1	highlight	Highlight Content 1	active	2026-07-19 20:59:41.827127	2026-07-20 00:24:31.580265	\N	highlight content 1
13	highlight	Highlight Content 2	active	2026-07-20 00:24:45.058479	2026-07-20 00:24:45.058479	\N	highlight content 2
14	highlight	Highlight Content 3	active	2026-07-20 00:24:51.963271	2026-07-20 00:24:51.963271	\N	highlight content 3
16	highlight	cd	inactive	2026-07-20 15:38:00.462892	2026-07-20 15:38:42.015894	2026-07-20 15:38:42.015894	cd
15	highlight	abc	inactive	2026-07-20 15:38:00.462892	2026-07-20 15:39:11.961943	2026-07-20 15:39:11.961943	abc
85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	hướng dẫn viên am hiểu văn hóa địa phương
86	highlight	Nhóm nhỏ, lịch trình linh hoạt	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	nhóm nhỏ, lịch trình linh hoạt
87	inclusion	Phương tiện di chuyển theo chương trình	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	phương tiện di chuyển theo chương trình
88	inclusion	Vé tham quan tại các điểm trong lịch trình	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	vé tham quan tại các điểm trong lịch trình
89	inclusion	Nước uống mỗi ngày	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	nước uống mỗi ngày
90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	chi phí cá nhân và đồ uống ngoài chương trình
91	requirement	Mang theo giấy tờ tùy thân	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	mang theo giấy tờ tùy thân
92	requirement	Chuẩn bị trang phục phù hợp thời tiết	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	chuẩn bị trang phục phù hợp thời tiết
93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	hoàn 100% khi hủy trước ngày khởi hành 7 ngày
94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	active	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	xác nhận đặt chỗ sau khi thanh toán thành công
\.


--
-- Data for Name: tour_content_item_link; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tour_content_item_link (tour_id, content_item_id, source_content_item_id, content_type, snapshot_content, sort_order, created_at) FROM stdin;
72	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
72	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
72	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
72	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
72	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
72	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
72	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
72	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
72	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
72	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
73	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
73	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
73	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
73	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
73	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
73	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
73	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
73	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
73	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
73	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
74	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
74	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
74	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
74	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
74	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
74	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
74	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
74	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
74	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
74	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
75	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
75	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
75	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
75	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
75	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
75	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
75	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
75	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
75	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
75	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
76	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
76	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
76	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
76	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
76	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
76	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
76	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
76	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
76	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
76	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
77	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
77	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
77	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
77	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
77	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
77	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
77	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
77	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
77	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
77	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
78	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
78	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
78	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
78	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
78	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
78	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
78	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
78	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
78	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
78	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
79	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
79	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
79	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
79	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
79	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
79	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
79	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
79	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
79	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
79	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
80	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
80	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
80	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
80	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
80	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
80	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
80	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
80	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
80	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
80	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
81	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
81	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
81	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
81	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
81	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
81	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
81	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
81	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
81	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
81	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
82	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
82	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
82	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
82	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
82	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
82	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
82	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
82	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
82	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
82	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
83	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
83	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
83	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
83	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
83	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
83	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
83	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
83	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
83	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
83	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
84	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
84	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
84	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
84	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
84	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
84	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
84	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
84	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
84	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
84	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
85	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
85	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
85	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
85	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
85	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
85	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
85	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
85	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
85	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
85	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
86	85	85	highlight	Hướng dẫn viên am hiểu văn hóa địa phương	1	2026-07-22 00:15:54.274445
86	86	86	highlight	Nhóm nhỏ, lịch trình linh hoạt	2	2026-07-22 00:15:54.274445
86	87	87	inclusion	Phương tiện di chuyển theo chương trình	3	2026-07-22 00:15:54.274445
86	88	88	inclusion	Vé tham quan tại các điểm trong lịch trình	4	2026-07-22 00:15:54.274445
86	89	89	inclusion	Nước uống mỗi ngày	5	2026-07-22 00:15:54.274445
86	90	90	exclusion	Chi phí cá nhân và đồ uống ngoài chương trình	6	2026-07-22 00:15:54.274445
86	91	91	requirement	Mang theo giấy tờ tùy thân	7	2026-07-22 00:15:54.274445
86	92	92	requirement	Chuẩn bị trang phục phù hợp thời tiết	8	2026-07-22 00:15:54.274445
86	93	93	cancellation_policy	Hoàn 100% khi hủy trước ngày khởi hành 7 ngày	9	2026-07-22 00:15:54.274445
86	94	94	booking_policy	Xác nhận đặt chỗ sau khi thanh toán thành công	10	2026-07-22 00:15:54.274445
\.


--
-- Data for Name: tour_destination; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tour_destination (tour_destination_id, tour_id, destination_id, order_index, estimated_time, note, created_at, updated_at, day_number, start_time, end_time, estimated_minutes, activity) FROM stdin;
10	3	2	1	\N	\N	2026-06-18 16:03:45.219335	2026-06-18 16:03:45.219335	1	\N	\N	\N	\N
86	36	33	1	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Bến Ninh Kiều
87	36	34	2	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	2	\N	\N	180	Tham quan Chợ nổi Cái Răng
88	37	34	1	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Chợ nổi Cái Răng
89	38	35	1	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Nhà cổ Bình Thủy
30	2	3	1	\N	\N	2026-06-23 18:29:41.041535	2026-06-23 18:29:41.041535	1	\N	\N	\N	\N
90	39	37	1	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Cồn Sơn
32	4	2	1	\N	\N	2026-06-23 20:33:50.622119	2026-06-23 20:33:50.622119	1	\N	\N	\N	\N
91	40	36	1	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Thiền viện Trúc Lâm Phương Nam
92	40	37	2	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Cồn Sơn
93	41	33	1	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	1	\N	\N	180	Tham quan Bến Ninh Kiều
36	5	2	1	\N	\N	2026-06-24 07:01:45.624569	2026-06-24 07:01:45.624569	1	\N	\N	\N	\N
94	41	34	2	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	2	\N	\N	180	Tham quan Chợ nổi Cái Răng
95	41	35	3	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	3	\N	\N	180	Tham quan Nhà cổ Bình Thủy
96	41	36	4	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	3	\N	\N	180	Tham quan Thiền viện Trúc Lâm Phương Nam
97	41	37	5	\N	Thời gian có thể điều chỉnh theo thời tiết và tình hình thực tế.	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	3	\N	\N	180	Tham quan Cồn Sơn
53	6	3	1	\N	\N	2026-07-20 14:11:40.574524	2026-07-20 14:11:40.574524	1	\N	\N	\N	\N
54	6	7	2	\N	\N	2026-07-20 14:11:40.574524	2026-07-20 14:11:40.574524	1	\N	\N	\N	\N
55	1	3	1	\N	\N	2026-07-21 20:06:52.478459	2026-07-21 20:06:52.478459	1	\N	\N	\N	\N
56	1	2	2	\N	\N	2026-07-21 20:06:52.478459	2026-07-21 20:06:52.478459	1	\N	\N	\N	\N
164	72	68	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Văn Miếu – Quốc Tử Giám
165	72	69	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Hoàng thành Thăng Long
166	73	68	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Văn Miếu – Quốc Tử Giám
167	73	69	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Hoàng thành Thăng Long
168	74	70	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Đại Nội Huế
169	74	71	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Chùa Thiên Mụ
170	75	70	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Đại Nội Huế
171	75	71	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	2	\N	\N	180	Tham quan Chùa Thiên Mụ
172	76	72	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Phố cổ Hội An
173	77	72	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Phố cổ Hội An
174	77	73	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	2	\N	\N	180	Tham quan Bà Nà Hills
175	78	75	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh
176	78	82	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Nhà hát Thành phố Hồ Chí Minh
177	79	74	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Chợ Bến Thành
178	80	76	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Núi Bà Đen
179	81	77	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Vườn quốc gia Tràm Chim
180	82	78	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Bãi Sao Phú Quốc
181	82	79	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	2	\N	\N	180	Tham quan Nhà tù Phú Quốc
182	82	80	3	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	3	\N	\N	180	Tham quan Làng chài Hàm Ninh
183	83	78	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Bãi Sao Phú Quốc
184	83	80	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Làng chài Hàm Ninh
185	84	81	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Vườn quốc gia Cát Tiên
186	85	68	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Văn Miếu – Quốc Tử Giám
187	85	69	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	2	\N	\N	180	Tham quan Hoàng thành Thăng Long
188	85	70	3	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	3	\N	\N	180	Tham quan Đại Nội Huế
189	85	71	4	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	4	\N	\N	180	Tham quan Chùa Thiên Mụ
190	85	72	5	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	5	\N	\N	180	Tham quan Phố cổ Hội An
191	85	73	6	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	6	\N	\N	180	Tham quan Bà Nà Hills
192	86	68	1	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	1	\N	\N	180	Tham quan Văn Miếu – Quốc Tử Giám
193	86	70	2	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	2	\N	\N	180	Tham quan Đại Nội Huế
194	86	72	3	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	3	\N	\N	180	Tham quan Phố cổ Hội An
195	86	75	4	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	4	\N	\N	180	Tham quan Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh
196	86	78	5	\N	Thứ tự có thể điều chỉnh theo điều kiện thực tế.	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	5	\N	\N	180	Tham quan Bãi Sao Phú Quốc
\.


--
-- Data for Name: travel_destination; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_destination (destination_id, name, description, thumbnail, created_at, updated_at, deleted_at, destination_category_id, latitude, longitude) FROM stdin;
2	Dinh Độc Lập	<p>Dinh Độc Lập là di tích lịch sử đặc biệt tại trung tâm Thành phố Hồ Chí Minh, nổi bật với kiến trúc hiện đại, các phòng khánh tiết và hệ thống hầm chỉ huy được bảo tồn.</p><p>Đây là điểm tham quan phù hợp cho du khách muốn tìm hiểu lịch sử Việt Nam và kiến trúc Sài Gòn thế kỷ XX.</p>	https://s3.cloudfly.vn/travellens/travel-destinations/1781622925188-1.png	2026-05-21 14:07:30.300756	2026-06-23 19:37:56.502682	\N	1	10.777035	106.695488
3	Bến Nhà Rồng – Bảo tàng Hồ Chí Minh	<p>Bến Nhà Rồng nằm bên sông Sài Gòn, là công trình kiến trúc lịch sử gắn với hành trình ra đi tìm đường cứu nước của Chủ tịch Hồ Chí Minh.</p><p>Không gian trưng bày giới thiệu nhiều tư liệu, hình ảnh và hiện vật quý về cuộc đời, sự nghiệp của Người.</p>	https://s3.cloudfly.vn/travellens/travel-destinations/1784652340240-ben-nha-rong.jpg	2026-05-27 13:59:27.396451	2026-07-21 23:45:34.100537	\N	1	10.768211	106.70667
4	Công viên Võ Chí Công	<p>Không gian công cộng xanh, thoáng đãng, phù hợp để đi bộ, thư giãn và khám phá nhịp sống đô thị.</p>	\N	2026-06-10 14:17:05.045635	2026-06-10 14:17:16.017492	2026-06-10 14:17:16.017492	1	10.7946	106.7423
6	Làng du lịch sinh thái Ông Đề	<p>Làng du lịch sinh thái Ông Đề tại Phong Điền, Cần Thơ mang đến trải nghiệm miệt vườn, trò chơi dân gian, ẩm thực miền Tây và các hoạt động tập thể gần gũi thiên nhiên.</p>	https://s3.cloudfly.vn/travellens/travel-destinations/1782231791429-langdulichsinhthaiongde-2-5737.jpg	2026-06-23 16:23:54.462494	2026-06-23 16:23:54.462494	\N	4	9.990583	105.709202
7	Trường Đại học FPT Cần Thơ	<p>Trường Đại học FPT Cần Thơ tọa lạc tại số 600 Nguyễn Văn Cừ nối dài. Khuôn viên nổi bật với kiến trúc hiện đại, không gian xanh và môi trường học tập gắn với công nghệ, quốc tế hóa và khởi nghiệp.</p>	https://s3.cloudfly.vn/travellens/travel-destinations/1782244022126-picture3-17171710448722083760711.png	2026-06-23 19:47:34.257503	2026-06-23 19:47:34.257503	\N	4	10.01349	105.731715
33	Bến Ninh Kiều	<p>Bến Ninh Kiều nằm bên dòng Hậu Giang, là biểu tượng du lịch của Cần Thơ với công viên ven sông, cầu đi bộ và khu chợ đêm sôi động.</p>	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	4	10.0344	105.7886
8	Dinh Độc Lập – Không gian trưng bày	<p>Không gian trưng bày tại Dinh Độc Lập giúp du khách tìm hiểu sâu hơn về lịch sử, kiến trúc và những sự kiện quan trọng diễn ra tại công trình này.</p>	https://s3.cloudfly.vn/travellens/travel-destinations/1782286635854-The-Independence-Palace-is-one-of-the-most-famous-historical-places-in-Vietnam.jpg	2026-06-24 07:37:19.436132	2026-07-01 15:17:00.835734	\N	1	10.777035	106.695523
5	Chợ nổi Cái Răng	<p>Chợ nổi Cái Răng là nét văn hóa sông nước đặc trưng của Cần Thơ, nhộn nhịp nhất vào sáng sớm với hoạt động mua bán nông sản và ẩm thực trên ghe thuyền.</p>	https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg	2026-06-10 14:22:45.463808	2026-06-10 14:22:53.54537	2026-06-10 14:22:53.54537	\N	10.006	105.7469
34	Chợ nổi Cái Răng	<p>Chợ nổi Cái Răng là không gian giao thương đặc trưng của miền Tây, nhộn nhịp từ sáng sớm với ghe thuyền bán trái cây, nông sản và món ăn địa phương.</p>	https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	4	10.006	105.7469
35	Nhà cổ Bình Thủy	<p>Nhà cổ Bình Thủy được xây dựng vào cuối thế kỷ XIX, nổi bật với sự giao thoa giữa kiến trúc Pháp và không gian sinh hoạt truyền thống Nam Bộ.</p>	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	4	10.0611	105.7585
36	Thiền viện Trúc Lâm Phương Nam	<p>Thiền viện Trúc Lâm Phương Nam có không gian thanh tịnh, kiến trúc Phật giáo truyền thống và khuôn viên rộng nhiều cây xanh.</p>	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	4	9.9962	105.6738
37	Cồn Sơn	<p>Cồn Sơn là điểm du lịch cộng đồng giữa sông Hậu, nơi du khách trải nghiệm vườn cây ăn trái, làm bánh dân gian và đời sống miệt vườn.</p>	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	4	10.115	105.7356
68	Văn Miếu – Quốc Tử Giám	<p>Văn Miếu – Quốc Tử Giám là điểm tham quan nổi bật, mang giá trị đặc trưng về văn hóa và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	30	21.0285	105.8355
69	Hoàng thành Thăng Long	<p>Hoàng thành Thăng Long là điểm tham quan nổi bật, mang giá trị đặc trưng về lịch sử và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	1	21.0352	105.8403
70	Đại Nội Huế	<p>Đại Nội Huế là điểm tham quan nổi bật, mang giá trị đặc trưng về lịch sử và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	1	16.4695	107.578
71	Chùa Thiên Mụ	<p>Chùa Thiên Mụ là điểm tham quan nổi bật, mang giá trị đặc trưng về tâm linh và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	31	16.4532	107.5449
72	Phố cổ Hội An	<p>Phố cổ Hội An là điểm tham quan nổi bật, mang giá trị đặc trưng về văn hóa và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	30	15.8801	108.338
73	Bà Nà Hills	<p>Bà Nà Hills là điểm tham quan nổi bật, mang giá trị đặc trưng về giải trí và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	32	15.9977	107.9881
74	Chợ Bến Thành	<p>Chợ Bến Thành là điểm tham quan nổi bật, mang giá trị đặc trưng về mua sắm và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	35	10.7725	106.698
75	Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh	<p>Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh là điểm tham quan nổi bật, mang giá trị đặc trưng về nghệ thuật và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	37	10.7699	106.6999
76	Núi Bà Đen	<p>Núi Bà Đen là điểm tham quan nổi bật, mang giá trị đặc trưng về tâm linh và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	31	11.3709	106.1718
77	Vườn quốc gia Tràm Chim	<p>Vườn quốc gia Tràm Chim là điểm tham quan nổi bật, mang giá trị đặc trưng về sinh thái và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	4	10.7253	105.5165
78	Bãi Sao Phú Quốc	<p>Bãi Sao Phú Quốc là điểm tham quan nổi bật, mang giá trị đặc trưng về biển đảo và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	36	10.058	104.0368
79	Nhà tù Phú Quốc	<p>Nhà tù Phú Quốc là điểm tham quan nổi bật, mang giá trị đặc trưng về lịch sử và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	1	10.0453	104.0172
80	Làng chài Hàm Ninh	<p>Làng chài Hàm Ninh là điểm tham quan nổi bật, mang giá trị đặc trưng về ẩm thực và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	33	10.1768	104.0498
81	Vườn quốc gia Cát Tiên	<p>Vườn quốc gia Cát Tiên là điểm tham quan nổi bật, mang giá trị đặc trưng về sinh thái và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	4	11.4235	107.4281
82	Nhà hát Thành phố Hồ Chí Minh	<p>Nhà hát Thành phố Hồ Chí Minh là điểm tham quan nổi bật, mang giá trị đặc trưng về kiến trúc và văn hóa bản địa.</p><p>Du khách nên dành thời gian tìm hiểu thông tin, tuân thủ quy định và giữ gìn cảnh quan khi tham quan.</p>	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	34	10.7765	106.703
\.


--
-- Data for Name: travel_post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_post (post_id, user_id, content, destination_id, location_id, status, visibility, like_count, comment_count, report_count, created_at, updated_at, deleted_at, share_count, previous_status, deleted_by, restored_at, restored_by) FROM stdin;
63	1	Buổi sáng yên bình và ánh sáng rất đẹp. Văn Miếu – Quốc Tử Giám thật sự là nơi nên ghé ít nhất một lần.	68	127	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
64	3	Một điểm đến có nhiều câu chuyện đáng để tìm hiểu. Hoàng thành Thăng Long thật sự là nơi nên ghé ít nhất một lần.	69	130	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
65	5	Món ăn địa phương ngon hơn mình mong đợi. Đại Nội Huế thật sự là nơi nên ghé ít nhất một lần.	70	131	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
66	10	Lịch trình hôm nay vừa đủ, không quá vội. Chùa Thiên Mụ thật sự là nơi nên ghé ít nhất một lần.	71	134	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
67	11	Kiến trúc và cảnh quan đều được giữ gìn tốt. Phố cổ Hội An thật sự là nơi nên ghé ít nhất một lần.	72	135	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
68	50	Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ. Bà Nà Hills thật sự là nơi nên ghé ít nhất một lần.	73	138	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
1	1	Buổi sáng ở Dinh Độc Lập rất dễ chịu. Nên đến sớm để có thời gian xem kỹ khu trưng bày và hầm chỉ huy.	2	1	published	public	2	2	1	2026-07-05 20:28:36.526374	2026-07-18 14:53:55.080162	\N	0	\N	\N	2026-07-18 14:53:55.080162	2
69	55	Buổi sáng yên bình và ánh sáng rất đẹp. Chợ Bến Thành thật sự là nơi nên ghé ít nhất một lần.	74	139	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
2	3	Vừa ghé Dinh Độc Lập, mình ấn tượng nhất với kiến trúc và những câu chuyện lịch sử được giữ gìn rất tốt.	2	1	published	public	0	1	1	2026-07-05 20:28:36.526374	2026-07-18 15:03:20.559977	\N	0	\N	\N	\N	\N
3	1	Gợi ý nhỏ: hãy dành ít nhất hai giờ cho Dinh Độc Lập và mang theo nước uống nếu tham quan vào buổi trưa.	2	1	published	public	2	0	0	2026-07-05 20:28:36.526374	2026-07-13 17:27:23.813847	\N	0	\N	\N	\N	\N
70	56	Một điểm đến có nhiều câu chuyện đáng để tìm hiểu. Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh thật sự là nơi nên ghé ít nhất một lần.	75	142	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
4	1	Một ngày khám phá Sài Gòn với Dinh Độc Lập và Bến Nhà Rồng, lịch trình vừa đủ và có nhiều góc chụp đẹp.	2	1	published	public	0	0	0	2026-07-05 20:54:47.565107	2026-07-05 20:54:47.565107	\N	0	\N	\N	\N	\N
71	57	Món ăn địa phương ngon hơn mình mong đợi. Núi Bà Đen thật sự là nơi nên ghé ít nhất một lần.	76	143	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
5	57	Không gian sinh thái ở Ông Đề xanh mát, các trò chơi dân gian rất vui khi đi cùng nhóm bạn.	6	\N	deleted	public	1	0	0	2026-07-05 21:08:08.189243	2026-07-19 20:48:21.910625	2026-07-19 20:48:21.910625	0	published	57	\N	\N
72	58	Lịch trình hôm nay vừa đủ, không quá vội. Vườn quốc gia Tràm Chim thật sự là nơi nên ghé ít nhất một lần.	77	146	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
6	1	Cuối tuần mình chọn đi dạo quanh trung tâm Cần Thơ, thưởng thức món địa phương và ngắm thành phố về đêm.	\N	\N	published	public	1	1	0	2026-07-05 21:12:16.670837	2026-07-20 21:13:10.456033	\N	2	\N	\N	\N	\N
7	57	Bến Nhà Rồng có kiến trúc đẹp và nhiều tư liệu lịch sử đáng xem. Khu vực ven sông cũng rất thoáng.	3	5	published	public	0	0	0	2026-07-05 21:18:11.1605	2026-07-19 20:28:18.479316	\N	1	\N	\N	\N	\N
8	57	Một buổi tham quan FPT Cần Thơ đầy năng lượng, khuôn viên rộng và kiến trúc các tòa nhà rất ấn tượng.	\N	\N	published	public	2	2	1	2026-07-05 21:19:01.177445	2026-07-21 02:56:53.428358	\N	0	\N	\N	2026-07-18 15:02:42.08641	2
9	57	Nếu đến Cần Thơ, bạn nên thử dậy sớm đi chợ nổi rồi ghé một khu sinh thái vào buổi chiều.	\N	\N	published	public	3	6	1	2026-07-05 21:26:13.077242	2026-07-21 02:57:54.888911	\N	7	\N	\N	\N	\N
10	1	Chuyến đi tháng 7 của mình có thời tiết khá đẹp, di chuyển thuận lợi và nhiều trải nghiệm đáng nhớ.	\N	\N	published	public	2	2	1	2026-07-13 21:12:50.664125	2026-07-18 22:51:50.825912	\N	0	\N	\N	\N	\N
11	58	Tòa Alpha tại FPT Cần Thơ có thiết kế độc đáo, nhiều ánh sáng tự nhiên và không gian học tập hiện đại.	\N	\N	published	public	1	3	0	2026-07-20 16:28:18.228484	2026-07-21 16:15:54.70979	\N	1	\N	\N	\N	\N
12	58	Ẩm thực miền Tây thật sự hấp dẫn; mình thích nhất các món dân dã được phục vụ ngay trong khu vườn.	\N	\N	published	public	0	0	0	2026-07-21 02:59:08.666196	2026-07-21 14:09:22.506286	\N	0	\N	\N	\N	\N
13	58	Lưu lại vài khoảnh khắc đẹp trong chuyến đi Cần Thơ. Nhất định mình sẽ quay lại vào mùa hè sau.	\N	\N	deleted	public	0	0	0	2026-07-21 14:09:56.502273	2026-07-21 14:10:12.663009	2026-07-21 14:10:12.663009	0	published	58	\N	\N
19	1	Hoàng hôn ở Bến Ninh Kiều rất đẹp, gió mát và không khí ven sông dễ chịu.	33	57	published	public	2	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
20	3	Dậy từ 5 giờ để đi chợ nổi hoàn toàn xứng đáng, mình đã thử hủ tiếu ngay trên ghe.	34	58	published	public	2	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
21	5	Nhà cổ Bình Thủy có nhiều chi tiết kiến trúc tinh tế và câu chuyện rất thú vị.	35	59	published	public	2	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
22	10	Một buổi sáng bình yên tại Thiền viện Trúc Lâm Phương Nam.	36	60	published	public	3	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
23	11	Trái cây ở Cồn Sơn đang đúng mùa, chủ vườn hướng dẫn rất nhiệt tình.	37	61	published	public	3	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
24	50	Cầu đi bộ Ninh Kiều là nơi mình thích nhất khi thành phố lên đèn.	33	62	published	public	3	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
25	55	Lần đầu tự tay làm bánh dân gian, thành phẩm chưa đẹp nhưng rất ngon.	34	63	published	public	3	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
26	56	Ba ngày ở Cần Thơ đủ để mình yêu thêm nhịp sống miền sông nước.	35	64	published	public	3	2	0	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N	0	\N	\N	\N	\N
73	59	Kiến trúc và cảnh quan đều được giữ gìn tốt. Bãi Sao Phú Quốc thật sự là nơi nên ghé ít nhất một lần.	78	147	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
74	60	Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ. Nhà tù Phú Quốc thật sự là nơi nên ghé ít nhất một lần.	79	150	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
75	61	Buổi sáng yên bình và ánh sáng rất đẹp. Làng chài Hàm Ninh thật sự là nơi nên ghé ít nhất một lần.	80	151	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
76	62	Một điểm đến có nhiều câu chuyện đáng để tìm hiểu. Vườn quốc gia Cát Tiên thật sự là nơi nên ghé ít nhất một lần.	81	154	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
77	63	Món ăn địa phương ngon hơn mình mong đợi. Nhà hát Thành phố Hồ Chí Minh thật sự là nơi nên ghé ít nhất một lần.	82	155	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
78	1	Lịch trình hôm nay vừa đủ, không quá vội. Văn Miếu – Quốc Tử Giám thật sự là nơi nên ghé ít nhất một lần.	68	128	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
79	3	Kiến trúc và cảnh quan đều được giữ gìn tốt. Hoàng thành Thăng Long thật sự là nơi nên ghé ít nhất một lần.	69	129	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
80	5	Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ. Đại Nội Huế thật sự là nơi nên ghé ít nhất một lần.	70	132	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
81	10	Buổi sáng yên bình và ánh sáng rất đẹp. Chùa Thiên Mụ thật sự là nơi nên ghé ít nhất một lần.	71	133	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
82	11	Một điểm đến có nhiều câu chuyện đáng để tìm hiểu. Phố cổ Hội An thật sự là nơi nên ghé ít nhất một lần.	72	136	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
83	50	Món ăn địa phương ngon hơn mình mong đợi. Bà Nà Hills thật sự là nơi nên ghé ít nhất một lần.	73	137	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
84	55	Lịch trình hôm nay vừa đủ, không quá vội. Chợ Bến Thành thật sự là nơi nên ghé ít nhất một lần.	74	140	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
85	56	Kiến trúc và cảnh quan đều được giữ gìn tốt. Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh thật sự là nơi nên ghé ít nhất một lần.	75	141	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
86	57	Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ. Núi Bà Đen thật sự là nơi nên ghé ít nhất một lần.	76	144	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
87	58	Buổi sáng yên bình và ánh sáng rất đẹp. Vườn quốc gia Tràm Chim thật sự là nơi nên ghé ít nhất một lần.	77	145	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
88	59	Một điểm đến có nhiều câu chuyện đáng để tìm hiểu. Bãi Sao Phú Quốc thật sự là nơi nên ghé ít nhất một lần.	78	148	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
89	60	Món ăn địa phương ngon hơn mình mong đợi. Nhà tù Phú Quốc thật sự là nơi nên ghé ít nhất một lần.	79	149	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
90	61	Lịch trình hôm nay vừa đủ, không quá vội. Làng chài Hàm Ninh thật sự là nơi nên ghé ít nhất một lần.	80	152	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
91	62	Kiến trúc và cảnh quan đều được giữ gìn tốt. Vườn quốc gia Cát Tiên thật sự là nơi nên ghé ít nhất một lần.	81	153	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
92	63	Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ. Nhà hát Thành phố Hồ Chí Minh thật sự là nơi nên ghé ít nhất một lần.	82	156	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
93	1	Buổi sáng yên bình và ánh sáng rất đẹp. Văn Miếu – Quốc Tử Giám thật sự là nơi nên ghé ít nhất một lần.	68	127	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
94	3	Một điểm đến có nhiều câu chuyện đáng để tìm hiểu. Hoàng thành Thăng Long thật sự là nơi nên ghé ít nhất một lần.	69	130	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
95	5	Món ăn địa phương ngon hơn mình mong đợi. Đại Nội Huế thật sự là nơi nên ghé ít nhất một lần.	70	131	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
96	10	Lịch trình hôm nay vừa đủ, không quá vội. Chùa Thiên Mụ thật sự là nơi nên ghé ít nhất một lần.	71	134	published	public	3	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
97	11	Kiến trúc và cảnh quan đều được giữ gìn tốt. Phố cổ Hội An thật sự là nơi nên ghé ít nhất một lần.	72	135	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
98	50	Mình đã lưu lại rất nhiều khoảnh khắc đáng nhớ. Bà Nà Hills thật sự là nơi nên ghé ít nhất một lần.	73	138	published	public	4	2	0	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N	0	\N	\N	\N	\N
\.


--
-- Data for Name: travel_post_comment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_post_comment (comment_id, post_id, user_id, parent_comment_id, content, status, created_at, updated_at, deleted_at) FROM stdin;
128	63	3	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
129	63	1	128	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
12	9	1	\N	Cuối tuần này mình cũng đang lên kế hoạch ghé thăm.	published	2026-07-13 20:16:52.923615	2026-07-13 20:16:52.923615	\N
130	64	5	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
13	9	1	12	Cảm ơn gợi ý rất chi tiết của bạn.	published	2026-07-13 20:16:59.518255	2026-07-13 20:16:59.518255	\N
131	64	3	130	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
132	65	10	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
133	65	5	132	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
134	66	11	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
135	66	10	134	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
136	67	50	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
137	67	11	136	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
138	68	55	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
14	9	57	\N	Đi theo nhóm chắc sẽ vui lắm.	published	2026-07-13 20:19:55.250644	2026-07-13 20:19:55.250644	\N
15	9	1	14	Mình thích nhất không gian xanh ở đây.	published	2026-07-13 20:20:14.182182	2026-07-13 20:20:14.182182	\N
16	6	57	\N	Đồ ăn địa phương có món nào nên thử vậy bạn?	published	2026-07-13 21:11:49.284945	2026-07-13 21:11:49.284945	\N
17	10	1	\N	Lịch trình này khá hợp lý và dễ áp dụng.	published	2026-07-13 21:13:34.227511	2026-07-13 21:13:39.760844	\N
18	9	57	\N	Mình từng đến đây và cũng có trải nghiệm rất tốt.	published	2026-07-13 21:44:34.862413	2026-07-13 21:44:41.587034	\N
139	68	50	138	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
140	69	56	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
141	69	55	140	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
19	9	1	18	Nhìn thôi đã muốn xách ba lô lên đường rồi.	published	2026-07-13 21:45:10.856749	2026-07-13 21:45:10.856749	\N
142	70	57	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
143	70	56	142	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
144	71	58	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
1	1	3	\N	Địa điểm này rất phù hợp cho một chuyến đi cuối tuần.	published	2026-07-05 20:28:36.526374	2026-07-05 20:28:36.526374	\N
2	2	1	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu lại cho lịch trình sắp tới.	published	2026-07-05 20:28:36.526374	2026-07-05 20:28:36.526374	\N
3	8	1	\N	Ảnh và trải nghiệm đều rất thú vị.	deleted	2026-07-13 17:21:37.818668	2026-07-13 20:02:08.738251	2026-07-13 20:02:08.738251
4	8	1	3	Mình cũng muốn ghé nơi này vào dịp gần nhất.	deleted	2026-07-13 17:24:03.390241	2026-07-13 17:24:20.008963	2026-07-13 17:24:20.008963
5	1	1	1	Thông tin hữu ích quá, cảm ơn bạn nhé!	published	2026-07-13 17:27:42.947672	2026-07-13 17:27:42.947672	\N
6	8	1	3	Đi vào buổi sáng sẽ mát và ít đông hơn.	published	2026-07-13 20:02:02.411735	2026-07-13 20:02:02.411735	\N
7	8	1	\N	Mình đã lưu địa điểm này rồi.	deleted	2026-07-13 20:02:15.586326	2026-07-13 20:02:31.843339	2026-07-13 20:02:31.843339
8	9	57	\N	Khung cảnh đẹp và có nhiều góc chụp ảnh.	deleted	2026-07-13 20:06:02.072185	2026-07-13 20:12:08.124105	2026-07-13 20:12:08.124105
9	9	57	8	Chuyến đi nghe hấp dẫn thật đấy!	deleted	2026-07-13 20:07:04.113906	2026-07-13 20:12:12.870759	2026-07-13 20:12:12.870759
10	9	1	8	Bạn có thể chia sẻ thêm kinh nghiệm di chuyển không?	deleted	2026-07-13 20:07:43.844294	2026-07-13 20:12:35.860908	2026-07-13 20:12:35.860908
11	9	1	8	Mình rất thích những địa điểm có giá trị lịch sử.	deleted	2026-07-13 20:11:40.562187	2026-07-13 20:12:37.258012	2026-07-13 20:12:37.258012
20	10	1	\N	Bài chia sẻ rất gần gũi và hữu ích.	published	2026-07-18 22:51:50.825912	2026-07-18 22:51:50.825912	\N
21	11	58	\N	Campus có kiến trúc thật ấn tượng.	published	2026-07-20 16:28:27.595982	2026-07-20 16:28:27.595982	\N
22	11	58	21	Mình đồng ý, buổi chiều ở đây rất đẹp.	deleted	2026-07-20 16:28:33.212631	2026-07-20 20:46:06.508719	2026-07-20 20:46:06.508719
23	8	58	6	Cảm ơn bạn, mình sẽ thử theo gợi ý này.	published	2026-07-20 20:28:13.681884	2026-07-20 20:28:13.681884	\N
24	8	58	23	Trải nghiệm tuyệt vời cho nhóm bạn.	deleted	2026-07-20 20:28:21.959338	2026-07-21 02:56:53.428358	2026-07-21 02:56:53.428358
25	11	58	21	Có dịp mình sẽ quay lại lần nữa.	deleted	2026-07-20 20:46:28.890694	2026-07-20 20:46:36.747832	2026-07-20 20:46:36.747832
26	11	58	21	Không gian sạch sẽ và khá yên bình.	deleted	2026-07-20 20:49:32.119525	2026-07-20 20:49:37.653504	2026-07-20 20:49:37.653504
27	11	58	\N	Một địa điểm đáng thêm vào danh sách.	deleted	2026-07-20 20:52:36.825423	2026-07-20 20:52:45.380147	2026-07-20 20:52:45.380147
28	11	58	\N	Ảnh đẹp quá, ánh sáng rất tự nhiên.	published	2026-07-20 20:52:40.757333	2026-07-20 20:52:40.757333	\N
29	11	58	28	Mình cũng rất thích trải nghiệm này.	published	2026-07-20 22:32:39.104136	2026-07-20 22:32:39.104136	\N
40	19	3	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
41	19	1	40	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
42	20	5	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
43	20	3	42	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
44	21	10	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
45	21	5	44	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
46	22	11	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
47	22	10	46	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
48	23	50	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
49	23	11	48	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
50	24	55	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
51	24	50	50	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
52	25	56	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
53	25	55	52	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
54	26	57	\N	Khung cảnh đẹp quá, mình sẽ thêm vào lịch trình sắp tới.	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
55	26	56	54	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:08:34.293735	2026-07-22 00:08:34.293735	\N
145	71	57	144	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
146	72	59	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
147	72	58	146	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
148	73	60	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
149	73	59	148	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
150	74	61	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
151	74	60	150	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
152	75	62	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
153	75	61	152	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
154	76	63	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
155	76	62	154	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
156	77	1	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
157	77	63	156	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
158	78	3	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
159	78	1	158	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
160	79	5	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
161	79	3	160	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
162	80	10	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
163	80	5	162	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
164	81	11	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
165	81	10	164	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
166	82	50	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
167	82	11	166	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
168	83	55	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
169	83	50	168	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
170	84	56	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
171	84	55	170	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
172	85	57	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
173	85	56	172	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
174	86	58	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
175	86	57	174	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
176	87	59	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
177	87	58	176	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
178	88	60	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
179	88	59	178	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
180	89	61	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
181	89	60	180	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
182	90	62	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
183	90	61	182	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
184	91	63	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
185	91	62	184	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
186	92	1	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
187	92	63	186	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
188	93	3	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
189	93	1	188	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
190	94	5	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
191	94	3	190	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
192	95	10	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
193	95	5	192	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
194	96	11	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
195	96	10	194	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
196	97	50	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
197	97	11	196	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
198	98	55	\N	Cảm ơn bạn đã chia sẻ, mình sẽ lưu địa điểm này lại.	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
199	98	50	198	Bạn nên ghé vào sáng sớm hoặc cuối chiều nhé!	published	2026-07-22 00:15:54.274445	2026-07-22 00:15:54.274445	\N
\.


--
-- Data for Name: travel_post_like; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_post_like (post_id, user_id, created_at) FROM stdin;
1	3	2026-07-05 20:28:36.526374
63	3	2026-07-22 00:15:54.274445
3	3	2026-07-05 20:28:36.526374
63	5	2026-07-22 00:15:54.274445
63	10	2026-07-22 00:15:54.274445
8	1	2026-07-13 16:16:44.616737
9	1	2026-07-13 16:16:59.933329
64	1	2026-07-22 00:15:54.274445
5	1	2026-07-13 16:18:14.5123
6	1	2026-07-13 17:27:03.822641
3	1	2026-07-13 17:27:23.813847
1	1	2026-07-13 17:28:13.471405
9	57	2026-07-13 20:06:07.12426
64	5	2026-07-22 00:15:54.274445
10	57	2026-07-13 21:42:11.10984
10	1	2026-07-18 22:51:45.16707
64	10	2026-07-22 00:15:54.274445
8	58	2026-07-20 20:21:32.340628
65	1	2026-07-22 00:15:54.274445
9	58	2026-07-20 20:29:33.397676
11	58	2026-07-21 16:15:54.70979
65	3	2026-07-22 00:15:54.274445
65	10	2026-07-22 00:15:54.274445
66	1	2026-07-22 00:15:54.274445
66	3	2026-07-22 00:15:54.274445
66	5	2026-07-22 00:15:54.274445
67	1	2026-07-22 00:15:54.274445
67	3	2026-07-22 00:15:54.274445
67	5	2026-07-22 00:15:54.274445
67	10	2026-07-22 00:15:54.274445
68	1	2026-07-22 00:15:54.274445
19	3	2026-07-22 00:08:34.293735
19	5	2026-07-22 00:08:34.293735
20	1	2026-07-22 00:08:34.293735
20	5	2026-07-22 00:08:34.293735
21	1	2026-07-22 00:08:34.293735
21	3	2026-07-22 00:08:34.293735
22	1	2026-07-22 00:08:34.293735
22	3	2026-07-22 00:08:34.293735
22	5	2026-07-22 00:08:34.293735
23	1	2026-07-22 00:08:34.293735
23	3	2026-07-22 00:08:34.293735
23	5	2026-07-22 00:08:34.293735
24	1	2026-07-22 00:08:34.293735
24	3	2026-07-22 00:08:34.293735
24	5	2026-07-22 00:08:34.293735
25	1	2026-07-22 00:08:34.293735
25	3	2026-07-22 00:08:34.293735
25	5	2026-07-22 00:08:34.293735
26	1	2026-07-22 00:08:34.293735
26	3	2026-07-22 00:08:34.293735
26	5	2026-07-22 00:08:34.293735
68	3	2026-07-22 00:15:54.274445
68	5	2026-07-22 00:15:54.274445
68	10	2026-07-22 00:15:54.274445
69	1	2026-07-22 00:15:54.274445
69	3	2026-07-22 00:15:54.274445
69	5	2026-07-22 00:15:54.274445
69	10	2026-07-22 00:15:54.274445
70	1	2026-07-22 00:15:54.274445
70	3	2026-07-22 00:15:54.274445
70	5	2026-07-22 00:15:54.274445
70	10	2026-07-22 00:15:54.274445
71	1	2026-07-22 00:15:54.274445
71	3	2026-07-22 00:15:54.274445
71	5	2026-07-22 00:15:54.274445
71	10	2026-07-22 00:15:54.274445
72	1	2026-07-22 00:15:54.274445
72	3	2026-07-22 00:15:54.274445
72	5	2026-07-22 00:15:54.274445
72	10	2026-07-22 00:15:54.274445
73	1	2026-07-22 00:15:54.274445
73	3	2026-07-22 00:15:54.274445
73	5	2026-07-22 00:15:54.274445
73	10	2026-07-22 00:15:54.274445
74	1	2026-07-22 00:15:54.274445
74	3	2026-07-22 00:15:54.274445
74	5	2026-07-22 00:15:54.274445
74	10	2026-07-22 00:15:54.274445
75	1	2026-07-22 00:15:54.274445
75	3	2026-07-22 00:15:54.274445
75	5	2026-07-22 00:15:54.274445
75	10	2026-07-22 00:15:54.274445
76	1	2026-07-22 00:15:54.274445
76	3	2026-07-22 00:15:54.274445
76	5	2026-07-22 00:15:54.274445
76	10	2026-07-22 00:15:54.274445
77	1	2026-07-22 00:15:54.274445
77	3	2026-07-22 00:15:54.274445
77	5	2026-07-22 00:15:54.274445
77	10	2026-07-22 00:15:54.274445
78	3	2026-07-22 00:15:54.274445
78	5	2026-07-22 00:15:54.274445
78	10	2026-07-22 00:15:54.274445
79	1	2026-07-22 00:15:54.274445
79	5	2026-07-22 00:15:54.274445
79	10	2026-07-22 00:15:54.274445
80	1	2026-07-22 00:15:54.274445
80	3	2026-07-22 00:15:54.274445
80	10	2026-07-22 00:15:54.274445
81	1	2026-07-22 00:15:54.274445
81	3	2026-07-22 00:15:54.274445
81	5	2026-07-22 00:15:54.274445
82	1	2026-07-22 00:15:54.274445
82	3	2026-07-22 00:15:54.274445
82	5	2026-07-22 00:15:54.274445
82	10	2026-07-22 00:15:54.274445
83	1	2026-07-22 00:15:54.274445
83	3	2026-07-22 00:15:54.274445
83	5	2026-07-22 00:15:54.274445
83	10	2026-07-22 00:15:54.274445
84	1	2026-07-22 00:15:54.274445
84	3	2026-07-22 00:15:54.274445
84	5	2026-07-22 00:15:54.274445
84	10	2026-07-22 00:15:54.274445
85	1	2026-07-22 00:15:54.274445
85	3	2026-07-22 00:15:54.274445
85	5	2026-07-22 00:15:54.274445
85	10	2026-07-22 00:15:54.274445
86	1	2026-07-22 00:15:54.274445
86	3	2026-07-22 00:15:54.274445
86	5	2026-07-22 00:15:54.274445
86	10	2026-07-22 00:15:54.274445
87	1	2026-07-22 00:15:54.274445
87	3	2026-07-22 00:15:54.274445
87	5	2026-07-22 00:15:54.274445
87	10	2026-07-22 00:15:54.274445
88	1	2026-07-22 00:15:54.274445
88	3	2026-07-22 00:15:54.274445
88	5	2026-07-22 00:15:54.274445
88	10	2026-07-22 00:15:54.274445
89	1	2026-07-22 00:15:54.274445
89	3	2026-07-22 00:15:54.274445
89	5	2026-07-22 00:15:54.274445
89	10	2026-07-22 00:15:54.274445
90	1	2026-07-22 00:15:54.274445
90	3	2026-07-22 00:15:54.274445
90	5	2026-07-22 00:15:54.274445
90	10	2026-07-22 00:15:54.274445
91	1	2026-07-22 00:15:54.274445
91	3	2026-07-22 00:15:54.274445
91	5	2026-07-22 00:15:54.274445
91	10	2026-07-22 00:15:54.274445
92	1	2026-07-22 00:15:54.274445
92	3	2026-07-22 00:15:54.274445
92	5	2026-07-22 00:15:54.274445
92	10	2026-07-22 00:15:54.274445
93	3	2026-07-22 00:15:54.274445
93	5	2026-07-22 00:15:54.274445
93	10	2026-07-22 00:15:54.274445
94	1	2026-07-22 00:15:54.274445
94	5	2026-07-22 00:15:54.274445
94	10	2026-07-22 00:15:54.274445
95	1	2026-07-22 00:15:54.274445
95	3	2026-07-22 00:15:54.274445
95	10	2026-07-22 00:15:54.274445
96	1	2026-07-22 00:15:54.274445
96	3	2026-07-22 00:15:54.274445
96	5	2026-07-22 00:15:54.274445
97	1	2026-07-22 00:15:54.274445
97	3	2026-07-22 00:15:54.274445
97	5	2026-07-22 00:15:54.274445
97	10	2026-07-22 00:15:54.274445
98	1	2026-07-22 00:15:54.274445
98	3	2026-07-22 00:15:54.274445
98	5	2026-07-22 00:15:54.274445
98	10	2026-07-22 00:15:54.274445
\.


--
-- Data for Name: travel_post_photo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_post_photo (photo_id, post_id, image_url, display_order, created_at, deleted_at) FROM stdin;
1	1	https://s3.cloudfly.vn/travellens/travel-feed/1783258672611-1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	0	2026-07-05 20:28:36.526374	\N
2	1	https://s3.cloudfly.vn/travellens/travel-feed/1783258673881-1780417888189-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	1	2026-07-05 20:28:36.526374	\N
3	2	https://s3.cloudfly.vn/travellens/travel-feed/1783258674266-1779895714183-screenshot_1773716998.png	0	2026-07-05 20:28:36.526374	\N
4	3	https://s3.cloudfly.vn/travellens/travel-feed/1783258674664-1779810494214-Screenshot-2026-03-16-073932.png	0	2026-07-05 20:28:36.526374	\N
5	4	https://s3.cloudfly.vn/travellens/travel-feed/1783258672611-1780417872885-_3911261f-c1f7-43c7-8c63-1cf813795905.jpg	0	2026-07-05 20:54:47.565107	\N
6	5	https://s3.cloudfly.vn/travellens/travel-feed/1783260491957-Screenshot-2026-07-05-210149.png	0	2026-07-05 21:08:08.189243	\N
8	9	https://s3.cloudfly.vn/travellens/travel-feed/1783261571190-Screenshot-2026-06-30-234857.png	0	2026-07-05 21:26:13.077242	\N
7	7	https://s3.cloudfly.vn/travellens/travel-feed/1783261094732-Screenshot-2026-06-30-161553.png	0	2026-07-05 21:18:11.1605	2026-07-19 19:58:01.72595
9	7	https://s3.cloudfly.vn/travellens/travel-feed/1784465739018-a1.png	0	2026-07-19 19:55:39.631419	2026-07-19 20:03:27.815078
10	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466201125-a3.png	0	2026-07-19 20:03:21.236695	\N
11	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222835-a4.png	1	2026-07-19 20:03:43.338047	\N
12	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222838-Screenshot-2026-03-15-064726.png	2	2026-07-19 20:03:43.338047	\N
13	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222840-Screenshot-2026-03-15-070432.png	3	2026-07-19 20:03:43.338047	\N
14	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222842-Screenshot-2026-03-15-071412.png	4	2026-07-19 20:03:43.338047	\N
15	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222843-Screenshot-2026-03-15-071451.png	5	2026-07-19 20:03:43.338047	\N
16	7	https://s3.cloudfly.vn/travellens/travel-feed/1784466222844-Screenshot-2026-03-15-211701.png	6	2026-07-19 20:03:43.338047	\N
17	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468956990-a1.png	0	2026-07-19 20:49:17.360134	\N
18	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468956999-a2.png	1	2026-07-19 20:49:17.360134	\N
19	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468957000-a3.png	2	2026-07-19 20:49:17.360134	\N
20	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468957001-a4.png	3	2026-07-19 20:49:17.360134	\N
21	8	https://s3.cloudfly.vn/travellens/travel-feed/1784468957003-Screenshot-2026-03-15-064726.png	4	2026-07-19 20:49:17.360134	\N
22	11	https://s3.cloudfly.vn/travellens/travel-feed/1784539695487-1.png	0	2026-07-20 16:28:18.228484	\N
23	12	https://s3.cloudfly.vn/travellens/travel-feed/1784577535593-scaled_1784577522504.jpg	0	2026-07-21 02:59:08.666196	\N
29	19	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	0	2026-07-22 00:08:34.293735	\N
30	20	https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg	0	2026-07-22 00:08:34.293735	\N
31	21	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	0	2026-07-22 00:08:34.293735	\N
32	22	https://upload.wikimedia.org/wikipedia/commons/5/56/Thi%E1%BB%81n_Vi%E1%BB%87n_Tr%C3%BAc_L%C3%A2m_Ph%C6%B0%C6%A1ng_Nam_(2).jpg	0	2026-07-22 00:08:34.293735	\N
33	23	https://scontent.iocvnpt.com/resources/portal/Images/CTO/superadminportal.cto/DiaDiem/ConSon/conson_avatar_637018231142067294.jpg	0	2026-07-22 00:08:34.293735	\N
34	24	https://upload.wikimedia.org/wikipedia/commons/5/54/Ninh_Kieu_Quay.jpg	0	2026-07-22 00:08:34.293735	\N
35	25	https://upload.wikimedia.org/wikipedia/commons/f/fb/Cai_Rang_Floating_Market_1.jpg	0	2026-07-22 00:08:34.293735	\N
36	26	https://upload.wikimedia.org/wikipedia/commons/e/e1/Nha_co_Binh_Thuy_1.jpg	0	2026-07-22 00:08:34.293735	\N
75	65	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	0	2026-07-22 00:15:54.274445	\N
73	63	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	0	2026-07-22 00:15:54.274445	\N
74	64	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	0	2026-07-22 00:15:54.274445	\N
76	66	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	0	2026-07-22 00:15:54.274445	\N
77	67	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	0	2026-07-22 00:15:54.274445	\N
78	68	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	0	2026-07-22 00:15:54.274445	\N
79	69	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	0	2026-07-22 00:15:54.274445	\N
80	70	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	0	2026-07-22 00:15:54.274445	\N
81	71	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	0	2026-07-22 00:15:54.274445	\N
82	72	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	0	2026-07-22 00:15:54.274445	\N
83	73	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	0	2026-07-22 00:15:54.274445	\N
84	74	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	0	2026-07-22 00:15:54.274445	\N
85	75	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	0	2026-07-22 00:15:54.274445	\N
86	76	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	0	2026-07-22 00:15:54.274445	\N
87	77	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	0	2026-07-22 00:15:54.274445	\N
88	78	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	0	2026-07-22 00:15:54.274445	\N
89	79	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	0	2026-07-22 00:15:54.274445	\N
90	80	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	0	2026-07-22 00:15:54.274445	\N
91	81	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	0	2026-07-22 00:15:54.274445	\N
92	82	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	0	2026-07-22 00:15:54.274445	\N
93	83	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	0	2026-07-22 00:15:54.274445	\N
94	84	https://upload.wikimedia.org/wikipedia/commons/f/f5/Ben_Thanh%2C_Ciudad_Ho_Chi_Minh%2C_Vietnam%2C_2013-08-14%2C_DD_01.JPG	0	2026-07-22 00:15:54.274445	\N
95	85	https://upload.wikimedia.org/wikipedia/commons/0/0f/B%E1%BA%A3o_t%C3%A0ng_M%E1%BB%B9_thu%E1%BA%ADt_Tp_(ki%E1%BA%BFn_tr%C3%BAc_t%E1%BB%95ng_th%E1%BB%83)_(2).jpg	0	2026-07-22 00:15:54.274445	\N
96	86	https://upload.wikimedia.org/wikipedia/commons/c/c7/Ba_Den_Mountain_summit_temple_illuminated_night_fog_Tay_Ninh_Vietnam.jpg	0	2026-07-22 00:15:54.274445	\N
97	87	https://upload.wikimedia.org/wikipedia/commons/f/fa/%C4%90%E1%BB%93ng_c%E1%BB%8F_v%C3%A0_chim_n%C6%B0%E1%BB%9Bc.jpg	0	2026-07-22 00:15:54.274445	\N
98	88	https://upload.wikimedia.org/wikipedia/commons/0/0b/B%C3%A3i_Sao_Beach.jpg	0	2026-07-22 00:15:54.274445	\N
99	89	https://upload.wikimedia.org/wikipedia/commons/2/2e/Nh%C3%A0_t%C3%B9_Ph%C3%BA_Qu%E1%BB%91c.JPG	0	2026-07-22 00:15:54.274445	\N
100	90	https://visitphuquoc.com.vn/VisitPhuQuoc/_default_upload_bucket/3251/image-thumb__3251__720_jpg/lang-chai-ham-ninh-phu-quoc_1743752658.166ec62c.jpg	0	2026-07-22 00:15:54.274445	\N
101	91	https://upload.wikimedia.org/wikipedia/commons/1/18/Cat_Tien_National_Park%2C_Vietnam.jpg	0	2026-07-22 00:15:54.274445	\N
102	92	https://upload.wikimedia.org/wikipedia/commons/6/6b/Saigon_Opera_House_2014.jpg	0	2026-07-22 00:15:54.274445	\N
103	93	https://upload.wikimedia.org/wikipedia/commons/b/b7/Main_gate_of_the_Temple_of_Literature%2C_Hanoi%2C_Vietnam%2C_20240123_0929_3068.jpg	0	2026-07-22 00:15:54.274445	\N
104	94	https://upload.wikimedia.org/wikipedia/commons/0/0f/Central_Sector_of_the_Imperial_Citadel_of_Thang_Long_-_Hanoi.jpg	0	2026-07-22 00:15:54.274445	\N
105	95	https://upload.wikimedia.org/wikipedia/commons/b/b9/Hue_Vietnam_Citadel-of-Hu%E1%BA%BF-13.jpg	0	2026-07-22 00:15:54.274445	\N
106	96	https://upload.wikimedia.org/wikipedia/commons/e/e7/Hue_Vietnam_Thien-Mu-Temple-and-Pagoda-01.jpg	0	2026-07-22 00:15:54.274445	\N
107	97	https://upload.wikimedia.org/wikipedia/commons/d/d6/H%E1%BB%99i_An%2C_Ancient_Town%2C_2020-01_CN-11.jpg	0	2026-07-22 00:15:54.274445	\N
108	98	https://upload.wikimedia.org/wikipedia/commons/0/0c/Golden_Bridge_at_Ba_Na_Hills_20250718.jpg	0	2026-07-22 00:15:54.274445	\N
\.


--
-- Data for Name: travel_post_report; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_post_report (report_id, post_id, user_id, reason, description, status, reviewed_by, reviewed_at, created_at) FROM stdin;
4	8	1	spam	\N	dismissed	2	2026-07-18 14:35:58.992318	2026-07-13 17:02:02.117375
7	1	58	harassment	test có comment	dismissed	2	2026-07-18 14:42:22.280439	2026-07-18 14:20:16.757393
1	9	1	spam	\N	resolved	2	2026-07-18 14:55:46.680232	2026-07-13 16:53:48.210505
8	10	58	inappropriate_content	test	resolved	2	2026-07-18 14:56:30.185803	2026-07-18 14:56:14.918917
9	2	58	spam	\N	pending	\N	\N	2026-07-18 15:03:20.559977
\.


--
-- Data for Name: travel_post_share; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_post_share (share_id, post_id, user_id, platform, counted, created_at) FROM stdin;
1	9	1	facebook	t	2026-07-13 20:36:15.76379
2	9	57	facebook	t	2026-07-13 20:36:28.617852
3	9	57	facebook	f	2026-07-13 20:36:48.35364
4	9	57	facebook	t	2026-07-13 20:42:24.500296
5	9	57	zalo	t	2026-07-13 20:43:00.380633
6	9	57	facebook	f	2026-07-13 20:43:07.677729
7	7	57	facebook	t	2026-07-13 20:43:28.078727
8	9	57	facebook	f	2026-07-13 20:45:49.999825
9	9	57	facebook	t	2026-07-13 20:48:24.358724
10	9	57	facebook	t	2026-07-13 21:44:07.820935
11	6	58	other	t	2026-07-20 20:23:15.850928
12	11	58	other	t	2026-07-20 20:23:23.851758
13	6	58	other	t	2026-07-20 21:13:10.456033
14	9	58	other	t	2026-07-21 02:57:54.888911
\.


--
-- Data for Name: travel_story; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_story (story_id, user_id, media_url, media_type, caption, status, expires_at, created_at, updated_at, deleted_at) FROM stdin;
1	58	https://s3.cloudfly.vn/travellens/travel-stories/1784477361877-1e15f66ec1eaaab1df942f9891bf8fc7.jpg	image	haha	active	2026-07-20 23:09:15.92167	2026-07-19 23:09:15.92167	2026-07-19 23:09:15.92167	\N
2	58	https://s3.cloudfly.vn/travellens/travel-stories/1784477420817-646814098_1388508773311572_2631454367341666066_n.jpg	image	TEST	active	2026-07-20 23:10:15.942343	2026-07-19 23:10:15.942343	2026-07-19 23:10:15.942343	\N
3	58	https://s3.cloudfly.vn/travellens/travel-stories/1784577607796-IMG_20260713_165831.jpg	image	mê	active	2026-07-22 03:00:12.110808	2026-07-21 03:00:12.110808	2026-07-21 03:00:12.110808	\N
\.


--
-- Data for Name: travel_story_view; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.travel_story_view (story_id, viewer_id, viewed_at) FROM stdin;
2	1	2026-07-19 23:23:28.00055
1	1	2026-07-19 23:23:30.174409
\.


--
-- Data for Name: user_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_block (blocker_id, blocked_id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, name, email, password, role, status, profile_info, google_id, avatar_url, created_at, updated_at, phone, date_of_birth, gender, address, otp, otp_expires_at) FROM stdin;
10	Đoàn Thị Yến Nhi	nhi@example.com	$2a$10$HQwrdrVWUTiD6aoeEZPdleBCPxsX2.6WapLohKHG9YrgVL5GsA7.q	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-05-30 13:32:54.312095	2026-05-30 13:32:54.312095	\N	\N	\N	\N	\N	\N
4	Nguyễn Chí Dương	nguyenchiduongp1@gmail.com	$2a$10$Wf1uJqSC8itb1h9/CuKDuOOF/LlvfZien.zij/8nLqLM/rukYsAlO	staff	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	114714939774840934464	https://lh3.googleusercontent.com/a/ACg8ocITjnrff5nW9MvHWIbkqcmzqdCN2TJdmK5gTsIn5CRosXjXpOzN=s96-c	2026-05-27 06:30:09.073204	2026-06-30 21:38:33.196729	0901234567	1998-05-17	male	Ho Chi Minh City	\N	\N
55	Lê Đăng Khoa	khoaldce181030@fpt.edu.vn	\N	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	114814988748013948873	https://lh3.googleusercontent.com/a/ACg8ocJY-qojIFgcNOoWjo-M9YuwUEv18CkSiY_Wra4s9YhKHKd96IY=s96-c	2026-06-24 06:08:53.214353	2026-06-24 06:08:53.214353	\N	\N	\N	\N	\N	\N
9	Nguyễn Trường	user.updated@eduxample.com	$2a$10$m3njYQNghlZyKZumHyQTgOMAGAhbMunkEMY47B96Kdtda/Jy6ERIm	staff	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-05-30 13:30:57.679208	2026-05-30 14:12:22.689994	0907654321	\N	\N	\N	\N	\N
3	Nguyễn Văn An	a@example.com	$2a$10$pY8ubqpoAk4q2HOFU5Lf2e5ra31OvG3GVkKLg90VvYFPPUl5PttPK	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	https://example.com/avatar.png	2026-05-25 13:21:52.960159	2026-05-25 13:21:52.960159	0763388151	\N	\N	\N	\N	\N
5	Nguyễn Văn Hoài	hoai@gmmail.com	$2a$10$B0Kx/j2hef7PZ/hbpKJbw.PHTWsl6ByPxmNa6p.FD0zFdYy5EEFzi	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-05-30 13:13:59.432767	2026-05-30 13:13:59.432767	0901234567	\N	\N	Ho Chi Minh City	\N	\N
49	Đoàn Nhi	nhidtyce180492@fpt.edu.vn	$2a$10$ImsIMvUxxpOsJ9jDPsdWhOe2DacsnZvlZCfVDMdg4p/xcdY3Jaymm	staff	pending	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-06-23 18:19:16.005327	2026-06-30 22:17:59.538447	\N	\N	\N	\N	\N	\N
11	Đặng Khoa	khoa@example.com	$2a$10$asM/6H9q8tI99aq2jUJUm.NCThgPYOOyWN6HSkkxWSpExLOAMavD.	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-06-02 15:16:17.996053	2026-06-02 15:17:30.870252	0901234567	\N	\N	\N	\N	\N
58	Phạm Văn Hoài	hoaipv.work@gmail.com	$2a$10$mYKao7wKppU30u7s5uydourdP0ra3UgsL9IFUkZ5VxFoTd4EflFfa	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	114255198313077573867	https://s3.cloudfly.vn/travellens/users/1784623588661-scaled_1784623581503.jpg	2026-06-29 23:07:38.525909	2026-07-21 15:46:44.756102	\N	2003-08-25	\N	\N	\N	\N
1	Nguyễn Văn Hoài	user@example.com	$2a$10$cSg6Iq6hkefzEXXwKZkhTu2m0Egkjq5/roIP0tohw3p9I.DEg964S	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	123456789	https://s3.cloudfly.vn/travellens/users/1781622860613-cae3fc6c-cfe5-46d2-a427-dd4b07b81c8b.png	2026-05-25 15:26:24.011982	2026-06-23 17:04:04.777395	0901234567	1998-05-05	male	Ho Chi Minh City	\N	\N
57	Nguyễn Chí Dương	duongncce180374@fpt.edu.vn	$2a$10$tUVdO9NCh8PmG63HZJvKc.j7pwzrxwiWubgYqA0MN0gZQGEPrIhrS	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	https://s3.cloudfly.vn/travellens/users/1782284749355-b59266e8-930f-47f5-95de-ee13c5d2e088.png	2026-06-24 07:05:53.452002	2026-07-02 14:31:37.761625	0763388155	2004-06-23	male	can tho	\N	\N
56	Lê Thịnh	lethinh15012004@gmail.com	$2a$10$TbVYlrmu7E2YyZQKDk5mSOEXuCZtPez41Ik4lFsGP2qeIL7PEqqsS	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-06-24 07:00:02.82027	2026-06-24 07:00:02.82027	\N	\N	\N	\N	\N	\N
50	Đoàn Nhi	yennhidoan08042004@gmail.com	$2a$10$9De03WPmg1v55p3te9thuuCTc./XW/M17.XVA4USTE/Jo5sdthnMK	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-06-23 18:20:10.018492	2026-06-23 18:20:10.018492	\N	\N	\N	\N	\N	\N
60	Phạm Văn Hoài	phamvanhoaifpt@gmail.com	$2a$10$llB2..nEjn0SoLpclCYpqOPKmiQmX8dBG12lBTuPuD/2nMcZymv5a	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-07-18 22:44:29.657127	2026-07-18 22:44:29.657127	\N	\N	\N	\N	\N	\N
52	Nhân viên TravelLens	staff@gmail.com	$2a$10$tnFCVcOKyyhWfqlKHWLaweAJHSrhoEao/0clGDjNKlFlbp8H9xJSO	staff	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-06-24 02:33:20.868995	2026-06-24 02:33:20.868995	0917823718	\N	\N	\N	\N	\N
61	Đăng Khoa Lê	ledangkhoadz@gmail.com	\N	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	114543733963395879004	https://lh3.googleusercontent.com/a/ACg8ocIlBD5ALpEVvVet5FCTi63N95Ra5kfB-PnM9GpsXQDq59CwZTu_=s96-c	2026-07-20 13:33:09.192231	2026-07-20 13:33:09.192231	\N	\N	\N	\N	\N	\N
62	Nguyễn Thị Ngọc Hoa	hoantncs180622@fpt.edu.vn	\N	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	103730734456845894234	https://lh3.googleusercontent.com/a/ACg8ocIdlB3JJB2y4dR1qDYIlVOky5TvdXh-yPAfXUpNFVLNgzuMFQ=s96-c	2026-07-20 13:37:26.418318	2026-07-20 13:37:26.418318	\N	\N	\N	\N	\N	\N
51	Phạm Văn Hoài	phamvanhoai600@gmail.com	$2a$10$CwHX7xEvoygH2No5cDQq3uECFuHGZfIFf.BDZGlHlAu51vgseFLsG	admin	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	106909240090457145701	https://lh3.googleusercontent.com/a/ACg8ocLmP-59JoleEp7y-dGXltBiTcqE9zeVvtMRcITlq9PrmjCVHpRE=s96-c	2026-06-23 18:56:17.183567	2026-06-29 16:29:09.854728	\N	2003-08-25	\N	\N	\N	\N
59	Lê Thịnh	thinhlce180136@fpt.edu.vn	\N	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	105133515427426848050	https://lh3.googleusercontent.com/a/ACg8ocJs5aFHpjO7F166jZWkc3mmr8SPWq1yYinr0X3PWBgL7dG88BU=s96-c	2026-06-30 15:49:28.55483	2026-06-30 15:49:28.55483	\N	\N	\N	\N	\N	\N
63	Phạm Văn Hoài	phamvanhoaiit@gmail.com	$2a$10$2TP1UwrhQ19bf/yAT0a9u.QNbKbat7pb2Yd4lMYtEOjmQKjk8FRJm	customer	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	\N	2026-07-21 02:21:39.867647	2026-07-21 02:21:39.867647	\N	\N	\N	\N	\N	\N
2	Admin TravelLens	admin@gmail.com	$2a$10$4sbO40qPjl.XW1mfKXFLruhwEZPGmHI67pvi1X6I1BKTmwby1lp3K	admin	active	Yêu thích khám phá văn hóa, ẩm thực và những điểm đến mới.	\N	https://s3.cloudfly.vn/travellens/users/1781624535743-f5bd27125cc31f2edbe359fb728eb8ab.jpg	2026-05-25 15:26:24.011982	2026-07-22 00:11:32.65778	\N	2000-01-01	\N	\N	\N	\N
\.


--
-- Data for Name: view360; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.view360 (view_id, location_id, description, audio_file, language, title, order_index, created_at, updated_at, deleted_at) FROM stdin;
2	4		https://s3.cloudfly.vn/travellens/view360-audio/1781939913232-River-Flows-In-You-Piano-00_00_00-00_01_13.mp3	Vietnamese	test	0	2026-06-20 07:12:53.823489	2026-07-20 15:00:43.851999	\N
150	158	Không gian tiếp đón trang trọng bên trong Dinh Độc Lập, thể hiện phong cách kiến trúc và nội thất tiêu biểu của công trình.	https://s3.cloudfly.vn/travellens/view360-audio/1784658258568-thuyet-minh-view360-150.mp3	Vietnamese	Toàn cảnh phòng khánh tiết Dinh Độc Lập	1	2026-07-22 01:23:59.475867	2026-07-22 01:24:18.720345	\N
149	157	Không gian trò chơi dân gian giữa cảnh quan miệt vườn, với cầu gỗ, chòi lá và các hoạt động tập thể đặc trưng miền Tây.	https://s3.cloudfly.vn/travellens/view360-audio/1784658264491-thuyet-minh-view360-149.mp3	Vietnamese	Toàn cảnh khu trò chơi dân gian Ông Đề	1	2026-07-22 01:23:58.08909	2026-07-22 01:24:18.720345	\N
3	1	Dinh Độc Lập được công nhận là Di tích lịch sử văn hóa quốc gia bằng Quyết định số 77A/VHQĐ ngày 25/6/1976 của Bộ trưởng Bộ Văn hóa. Ngày 12 tháng 8 năm 2009, Thủ tướng Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam đã ký Quyết định số 1272/QĐ-TTg xếp hạng Di tích lịch sử Dinh Độc Lập là một trong 10 di tích quốc gia đặc biệt đầu tiên của cả nước.	https://s3.cloudfly.vn/travellens/view360-audio/1781967828429-Dinh-c-L-p.mp3	Vietnamese	Dinh Độc Lập	0	2026-06-20 15:03:56.6831	2026-06-20 15:03:56.6831	\N
1	1	360 experience at the main gate	https://example.com/audio-url.mp3	vi	Main Gate 360 View	1	2026-05-25 14:11:06.517658	2026-06-23 19:58:10.472888	2026-06-23 19:58:10.472888
4	5	vgdvsdcg	https://s3.cloudfly.vn/travellens/view360-audio/1782286844813-Dinh-c-L-p.mp3	Vietnamese	Test	0	2026-06-24 07:40:48.132357	2026-06-24 07:40:48.132357	\N
5	7	Toạ lạc tại số 600 Nguyễn Văn Cừ nối dài, TP Cần Thơ, Trường Đại học FPT trở thành một không gian học tập chuẩn quốc tế dành cho sinh viên ngay tại Đồng bằng Sông Cửu Long với các nhóm ngành Công Nghệ Thông Tin, Quản trị kinh doanh, Công nghệ Truyền thông, Luật và Ngôn ngữ. Với phương châm Trải nghiệm để thành công, Trường Đại học FPT tự hào mang đến cho sinh viên một môi trường học tập đa trải nghiệm với 3 trụ cột chính Công nghệ, Quốc tế và Khởi nghiệp, cung cấp cho thị trường lao động nguồn nhân lực chất lượng cao, sở hữu đầy đủ các phẩm chất cần thiết từ kiến thức chuyên môn, kỹ năng mềm đến tư duy công nghệ và thái độ chuyên nghiệp trong công việc.	https://s3.cloudfly.vn/travellens/view360-audio/1782917223358-Ki-u_Nhi_To-_l-c_t-i_s-_600_4589346ef301.mp3	Vietnamese	FPT	0	2026-07-01 21:47:16.872006	2026-07-20 09:26:18.539696	\N
53	61	Khám phá không gian Nhà chính Bình Thủy qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657224908-thuyet-minh-view360-53.mp3	vi	Toàn cảnh Nhà chính Bình Thủy	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
52	60	Khám phá không gian Khu ghe ẩm thực qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657225625-thuyet-minh-view360-52.mp3	vi	Toàn cảnh Khu ghe ẩm thực	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
50	58	Khám phá không gian Cầu đi bộ Ninh Kiều qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657226223-thuyet-minh-view360-50.mp3	vi	Toàn cảnh Cầu đi bộ Ninh Kiều	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
54	62	Khám phá không gian Vườn lan Bình Thủy qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657232876-thuyet-minh-view360-54.mp3	vi	Toàn cảnh Vườn lan Bình Thủy	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
55	63	Khám phá không gian Chánh điện qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657239492-thuyet-minh-view360-55.mp3	vi	Toàn cảnh Chánh điện	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
6	8	Tòa nhà hiệu bộ Alpha tại campus Cần Thơ có tổng diện tích sàn xây dựng gần 25.000 m2. Kết cấu gồm 1 tầng bán hầm, 9 tầng nổi và tum thang có mái che. Công trình có kiến trúc mặt đứng, thiết kế đồng điệu với tổng thể các tòa nhà khác và lấy ý tưởng chính từ họa tiết Penrose.\r\n\r\nQuy mô gồm 136 phòng học và phòng chức năng, đáp ứng nhu cầu học tập và sinh hoạt của hơn 5.000 cán bộ, giáo viên, sinh viên. Tòa nhà được kỳ vọng sẽ góp phần giúp nhà trường thực hiện tốt sứ mệnh cung cấp nguồn nhân lực số nhạy bén với cuộc cách mạng 4.0, giỏi về khoa học - công nghệ, qua đó cung ứng nguồn lao động chất lượng cao cho Đồng bằng sông Cửu Long.	https://s3.cloudfly.vn/travellens/view360-audio/1784515969258-T-a-Alpha-H-fpt-c-n-th.mp3	Vietnamese	Sảnh Tòa Alpha ĐH fpt cần thơ	0	2026-07-20 09:52:52.247056	2026-07-20 10:00:36.159834	\N
51	59	Khám phá không gian Bến tàu chợ nổi qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657215241-thuyet-minh-view360-51.mp3	vi	Toàn cảnh Bến tàu chợ nổi	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
49	57	Khám phá không gian Công viên Ninh Kiều qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657215571-thuyet-minh-view360-49.mp3	vi	Toàn cảnh Công viên Ninh Kiều	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
57	65	Khám phá không gian Vườn trái cây Cồn Sơn qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657240064-thuyet-minh-view360-57.mp3	vi	Toàn cảnh Vườn trái cây Cồn Sơn	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
56	64	Khám phá không gian Vườn thiền qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657245584-thuyet-minh-view360-56.mp3	vi	Toàn cảnh Vườn thiền	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
58	66	Khám phá không gian Khu làm bánh dân gian qua hình ảnh toàn cảnh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657248156-thuyet-minh-view360-58.mp3	vi	Toàn cảnh Khu làm bánh dân gian	1	2026-07-22 00:08:34.293735	2026-07-22 01:09:34.51547	\N
119	127	Hình ảnh toàn cảnh tại Khuê Văn Các.	https://s3.cloudfly.vn/travellens/view360-audio/1784657249406-thuyet-minh-view360-119.mp3	vi	Toàn cảnh Khuê Văn Các	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
120	128	Hình ảnh toàn cảnh tại Nhà Thái Học.	https://s3.cloudfly.vn/travellens/view360-audio/1784657256997-thuyet-minh-view360-120.mp3	vi	Toàn cảnh Nhà Thái Học	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
122	130	Hình ảnh toàn cảnh tại Khu khảo cổ 18 Hoàng Diệu.	https://s3.cloudfly.vn/travellens/view360-audio/1784657257555-thuyet-minh-view360-122.mp3	vi	Toàn cảnh Khu khảo cổ 18 Hoàng Diệu	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
121	129	Hình ảnh toàn cảnh tại Đoan Môn.	https://s3.cloudfly.vn/travellens/view360-audio/1784657258934-thuyet-minh-view360-121.mp3	vi	Toàn cảnh Đoan Môn	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
124	132	Hình ảnh toàn cảnh tại Điện Thái Hòa.	https://s3.cloudfly.vn/travellens/view360-audio/1784657267742-thuyet-minh-view360-124.mp3	vi	Toàn cảnh Điện Thái Hòa	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
123	131	Hình ảnh toàn cảnh tại Ngọ Môn.	https://s3.cloudfly.vn/travellens/view360-audio/1784657269545-thuyet-minh-view360-123.mp3	vi	Toàn cảnh Ngọ Môn	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
125	133	Hình ảnh toàn cảnh tại Tháp Phước Duyên.	https://s3.cloudfly.vn/travellens/view360-audio/1784657277894-thuyet-minh-view360-125.mp3	vi	Toàn cảnh Tháp Phước Duyên	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
126	134	Hình ảnh toàn cảnh tại Điện Đại Hùng.	https://s3.cloudfly.vn/travellens/view360-audio/1784657280220-thuyet-minh-view360-126.mp3	vi	Toàn cảnh Điện Đại Hùng	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
127	135	Hình ảnh toàn cảnh tại Chùa Cầu.	https://s3.cloudfly.vn/travellens/view360-audio/1784657285591-thuyet-minh-view360-127.mp3	vi	Toàn cảnh Chùa Cầu	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
128	136	Hình ảnh toàn cảnh tại Hội quán Phúc Kiến.	https://s3.cloudfly.vn/travellens/view360-audio/1784657286384-thuyet-minh-view360-128.mp3	vi	Toàn cảnh Hội quán Phúc Kiến	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
130	138	Hình ảnh toàn cảnh tại Làng Pháp.	https://s3.cloudfly.vn/travellens/view360-audio/1784657294614-thuyet-minh-view360-130.mp3	vi	Toàn cảnh Làng Pháp	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
129	137	Hình ảnh toàn cảnh tại Cầu Vàng.	https://s3.cloudfly.vn/travellens/view360-audio/1784657295194-thuyet-minh-view360-129.mp3	vi	Toàn cảnh Cầu Vàng	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
131	139	Hình ảnh toàn cảnh tại Cửa Nam.	https://s3.cloudfly.vn/travellens/view360-audio/1784657303211-thuyet-minh-view360-131.mp3	vi	Toàn cảnh Cửa Nam	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
133	141	Hình ảnh toàn cảnh tại Tòa nhà chính.	https://s3.cloudfly.vn/travellens/view360-audio/1784657305086-thuyet-minh-view360-133.mp3	vi	Toàn cảnh Tòa nhà chính	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
132	140	Hình ảnh toàn cảnh tại Khu ẩm thực.	https://s3.cloudfly.vn/travellens/view360-audio/1784657314455-thuyet-minh-view360-132.mp3	vi	Toàn cảnh Khu ẩm thực	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
134	142	Hình ảnh toàn cảnh tại Khu trưng bày nghệ thuật hiện đại.	https://s3.cloudfly.vn/travellens/view360-audio/1784657314927-thuyet-minh-view360-134.mp3	vi	Toàn cảnh Khu trưng bày nghệ thuật hiện đại	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
135	143	Hình ảnh toàn cảnh tại Chùa Bà.	https://s3.cloudfly.vn/travellens/view360-audio/1784657318231-thuyet-minh-view360-135.mp3	vi	Toàn cảnh Chùa Bà	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
136	144	Hình ảnh toàn cảnh tại Đỉnh Vân Sơn.	https://s3.cloudfly.vn/travellens/view360-audio/1784657326482-thuyet-minh-view360-136.mp3	vi	Toàn cảnh Đỉnh Vân Sơn	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
139	147	Hình ảnh toàn cảnh tại Bãi tắm trung tâm.	https://s3.cloudfly.vn/travellens/view360-audio/1784657334840-thuyet-minh-view360-139.mp3	vi	Toàn cảnh Bãi tắm trung tâm	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
138	146	Hình ảnh toàn cảnh tại Tuyến xuồng xuyên rừng.	https://s3.cloudfly.vn/travellens/view360-audio/1784657335488-thuyet-minh-view360-138.mp3	vi	Toàn cảnh Tuyến xuồng xuyên rừng	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
137	145	Hình ảnh toàn cảnh tại Trạm quan sát chim.	https://s3.cloudfly.vn/travellens/view360-audio/1784657336909-thuyet-minh-view360-137.mp3	vi	Toàn cảnh Trạm quan sát chim	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
140	148	Hình ảnh toàn cảnh tại Khu chèo kayak.	https://s3.cloudfly.vn/travellens/view360-audio/1784657347180-thuyet-minh-view360-140.mp3	vi	Toàn cảnh Khu chèo kayak	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
142	150	Hình ảnh toàn cảnh tại Khu tái hiện lịch sử.	https://s3.cloudfly.vn/travellens/view360-audio/1784657351583-thuyet-minh-view360-142.mp3	vi	Toàn cảnh Khu tái hiện lịch sử	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
141	149	Hình ảnh toàn cảnh tại Nhà trưng bày.	https://s3.cloudfly.vn/travellens/view360-audio/1784657352381-thuyet-minh-view360-141.mp3	vi	Toàn cảnh Nhà trưng bày	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
143	151	Hình ảnh toàn cảnh tại Cầu cảng Hàm Ninh.	https://s3.cloudfly.vn/travellens/view360-audio/1784657361746-thuyet-minh-view360-143.mp3	vi	Toàn cảnh Cầu cảng Hàm Ninh	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
144	152	Hình ảnh toàn cảnh tại Khu hải sản.	https://s3.cloudfly.vn/travellens/view360-audio/1784657362163-thuyet-minh-view360-144.mp3	vi	Toàn cảnh Khu hải sản	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
145	153	Hình ảnh toàn cảnh tại Bàu Sấu.	https://s3.cloudfly.vn/travellens/view360-audio/1784657367817-thuyet-minh-view360-145.mp3	vi	Toàn cảnh Bàu Sấu	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
147	155	Hình ảnh toàn cảnh tại Sảnh chính.	https://s3.cloudfly.vn/travellens/view360-audio/1784657374175-thuyet-minh-view360-147.mp3	vi	Toàn cảnh Sảnh chính	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
146	154	Hình ảnh toàn cảnh tại Tuyến cây cổ thụ.	https://s3.cloudfly.vn/travellens/view360-audio/1784657374220-thuyet-minh-view360-146.mp3	vi	Toàn cảnh Tuyến cây cổ thụ	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
148	156	Hình ảnh toàn cảnh tại Khán phòng.	https://s3.cloudfly.vn/travellens/view360-audio/1784657380240-thuyet-minh-view360-148.mp3	vi	Toàn cảnh Khán phòng	1	2026-07-22 00:15:54.274445	2026-07-22 01:09:34.51547	\N
\.


--
-- Data for Name: view360_hotspot; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.view360_hotspot (hotspot_id, view360_id, type, title, description, yaw, pitch, target_view360_id, target_url, order_index, is_active, created_at, updated_at, deleted_at) FROM stdin;
3	5	info	Tòa Beta	\N	162.4000	6.4000	\N	\N	0	t	2026-07-20 09:25:51.466847	2026-07-20 09:25:51.466847	\N
5	5	info	Sân Bóng	\N	127.8000	-33.2000	\N	\N	0	t	2026-07-20 09:26:14.024296	2026-07-20 09:26:14.024296	\N
2	5	location	Tòa Gramma	Phường An Bình, Quận Ninh Kiều và Phường Long Tuyền, Quận Bình Thủy, TP. Cần Thơ	113.9000	19.0000	\N	\N	0	t	2026-07-20 09:25:33.769355	2026-07-20 09:28:50.200423	\N
4	5	navigation	Tòa Alpha	Tòa nhà hiệu bộ Alpha tại campus Cần Thơ có tổng diện tích sàn xây dựng gần 25.000 m2. Kết cấu gồm 1 tầng bán hầm, 9 tầng nổi và tum thang có mái che. Công trình có kiến trúc mặt đứng, thiết kế đồng điệu với tổng thể các tòa nhà khác và lấy ý tưởng chính từ họa tiết Penrose.\n\nQuy mô gồm 136 phòng học và phòng chức năng, đáp ứng nhu cầu học tập và sinh hoạt của hơn 5.000 cán bộ, giáo viên, sinh viên. Tòa nhà được kỳ vọng sẽ góp phần giúp nhà trường thực hiện tốt sứ mệnh cung cấp nguồn nhân lực số nhạy bén với cuộc cách mạng 4.0, giỏi về khoa học - công nghệ, qua đó cung ứng nguồn lao động chất lượng cao cho Đồng bằng sông Cửu Long.	220.9000	25.3000	6	\N	0	t	2026-07-20 09:26:03.871245	2026-07-20 09:55:43.550221	\N
6	3	info	Giới thiệu Cổng chính Dinh Độc Lập	Dinh Độc Lập được công nhận là Di tích lịch sử văn hóa quốc gia bằng Quyết định số 77A/VHQĐ ngày 25/6/1976 của Bộ trưởng Bộ Văn hóa. Ngày 12 tháng 8 năm 2009, Thủ tướng Chính phủ nước Cộng hòa Xã hội Chủ nghĩa Việt Nam đã ký Quyết định số 1272/QĐ-TTg xếp hạng Di tích lịch sử Dinh Độc Lập là một trong 10 di tích quốc gia đặc biệt đầu tiên của cả nước.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
7	3	location	Vị trí Cổng chính Dinh Độc Lập	Tọa độ 10.777931, 106.696295. Không gian này thuộc Dinh Độc Lập.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
8	3	link	Khám phá Dinh Độc Lập	Xem thông tin, hình ảnh và nội dung liên quan đến Dinh Độc Lập.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/2	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
9	4	info	Giới thiệu Sân ngắm cảnh Bến Nhà Rồng	vgdvsdcg	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
10	4	location	Vị trí Sân ngắm cảnh Bến Nhà Rồng	Tọa độ 10.768350, 106.706420. Không gian này thuộc Bến Nhà Rồng – Bảo tàng Hồ Chí Minh.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
11	4	link	Khám phá Bến Nhà Rồng – Bảo tàng Hồ Chí Minh	Xem thông tin, hình ảnh và nội dung liên quan đến Bến Nhà Rồng – Bảo tàng Hồ Chí Minh.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/3	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
12	149	info	Giới thiệu Khu trò chơi dân gian Ông Đề	Không gian trò chơi dân gian giữa cảnh quan miệt vườn, với cầu gỗ, chòi lá và các hoạt động tập thể đặc trưng miền Tây.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
13	149	location	Vị trí Khu trò chơi dân gian Ông Đề	Tọa độ 9.990700, 105.709100. Không gian này thuộc Làng du lịch sinh thái Ông Đề.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
14	149	link	Khám phá Làng du lịch sinh thái Ông Đề	Xem thông tin, hình ảnh và nội dung liên quan đến Làng du lịch sinh thái Ông Đề.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/6	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
15	2	navigation	Đi đến Khu giới thiệu Đại học FPT Cần Thơ	Chuyển sang không gian 360 tại Khu giới thiệu Đại học FPT Cần Thơ, cùng điểm đến Trường Đại học FPT Cần Thơ.	35.0000	-4.0000	5	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
16	2	info	Giới thiệu Tòa nhà Gamma	Tòa nhà Gamma là một điểm tham quan thuộc Trường Đại học FPT Cần Thơ.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
17	2	location	Vị trí Tòa nhà Gamma	Tọa độ 10.012885, 105.730807. Không gian này thuộc Trường Đại học FPT Cần Thơ.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
18	5	info	Giới thiệu Khu giới thiệu Đại học FPT Cần Thơ	Toạ lạc tại số 600 Nguyễn Văn Cừ nối dài, TP Cần Thơ, Trường Đại học FPT trở thành một không gian học tập chuẩn quốc tế dành cho sinh viên ngay tại Đồng bằng Sông Cửu Long với các nhóm ngành Công Nghệ Thông Tin, Quản trị kinh doanh, Công nghệ Truyền thông, Luật và Ngôn ngữ. Với phương châm Trải nghiệm để thành công, Trường Đại học FPT tự hào mang đến cho sinh viên một môi trường học tập đa trải nghiệm với 3 trụ cột chính Công nghệ, Quốc tế và Khởi nghiệp, cung cấp cho thị trường lao động nguồn nhân lực chất lượng cao, sở hữu đầy đủ các phẩm chất cần thiết từ kiến thức chuyên môn, kỹ năng mềm đến tư duy công nghệ và thái độ chuyên nghiệp trong công việc.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
19	5	location	Vị trí Khu giới thiệu Đại học FPT Cần Thơ	Tọa độ 10.013091, 105.731714. Không gian này thuộc Trường Đại học FPT Cần Thơ.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
20	6	navigation	Đi đến Tòa nhà Gamma	Chuyển sang không gian 360 tại Tòa nhà Gamma, cùng điểm đến Trường Đại học FPT Cần Thơ.	201.0000	-4.0000	2	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
21	6	info	Giới thiệu Tòa nhà Alpha – Đại học FPT Cần Thơ	Tòa nhà hiệu bộ Alpha tại campus Cần Thơ có tổng diện tích sàn xây dựng gần 25.000 m2. Kết cấu gồm 1 tầng bán hầm, 9 tầng nổi và tum thang có mái che. Công trình có kiến trúc mặt đứng, thiết kế đồng điệu với tổng thể các tòa nhà khác và lấy ý tưởng chính từ họa tiết Penrose.\r\n\r\nQuy mô gồm 136 phòng học và phòng chức năng, đáp ứng nhu cầu học tập và sinh hoạt của hơn 5.000 cán bộ, giáo viên, sinh viên. Tòa nhà được kỳ vọng sẽ góp phần giúp nhà trường thực hiện tốt sứ mệnh cung cấp nguồn nhân lực số nhạy bén với cuộc cách mạng 4.0, giỏi về khoa học - công nghệ, qua đó cung ứng nguồn lao động chất lượng cao cho Đồng bằng sông Cửu Long.	287.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
22	6	location	Vị trí Tòa nhà Alpha – Đại học FPT Cần Thơ	Tọa độ 10.013772, 105.731805. Không gian này thuộc Trường Đại học FPT Cần Thơ.	13.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
23	2	link	Khám phá Trường Đại học FPT Cần Thơ	Xem thông tin, hình ảnh và nội dung liên quan đến Trường Đại học FPT Cần Thơ.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/7	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
24	150	info	Giới thiệu Phòng khánh tiết Dinh Độc Lập	Không gian tiếp đón trang trọng bên trong Dinh Độc Lập, thể hiện phong cách kiến trúc và nội thất tiêu biểu của công trình.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
25	150	location	Vị trí Phòng khánh tiết Dinh Độc Lập	Tọa độ 10.777200, 106.695500. Không gian này thuộc Dinh Độc Lập – Không gian trưng bày.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
26	150	link	Khám phá Dinh Độc Lập – Không gian trưng bày	Xem thông tin, hình ảnh và nội dung liên quan đến Dinh Độc Lập – Không gian trưng bày.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/8	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
27	49	navigation	Đi đến Cầu đi bộ Ninh Kiều	Chuyển sang không gian 360 tại Cầu đi bộ Ninh Kiều, cùng điểm đến Bến Ninh Kiều.	35.0000	-4.0000	50	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
28	49	info	Giới thiệu Công viên Ninh Kiều	Khám phá không gian Công viên Ninh Kiều qua hình ảnh toàn cảnh.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
29	49	location	Vị trí Công viên Ninh Kiều	Tọa độ 10.034800, 105.789000. Không gian này thuộc Bến Ninh Kiều.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
30	50	navigation	Đi đến Công viên Ninh Kiều	Chuyển sang không gian 360 tại Công viên Ninh Kiều, cùng điểm đến Bến Ninh Kiều.	118.0000	-4.0000	49	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
31	50	info	Giới thiệu Cầu đi bộ Ninh Kiều	Khám phá không gian Cầu đi bộ Ninh Kiều qua hình ảnh toàn cảnh.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
32	50	location	Vị trí Cầu đi bộ Ninh Kiều	Tọa độ 10.036200, 105.791100. Không gian này thuộc Bến Ninh Kiều.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
33	49	link	Khám phá Bến Ninh Kiều	Xem thông tin, hình ảnh và nội dung liên quan đến Bến Ninh Kiều.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/33	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
34	51	navigation	Đi đến Khu ghe ẩm thực	Chuyển sang không gian 360 tại Khu ghe ẩm thực, cùng điểm đến Chợ nổi Cái Răng.	35.0000	-4.0000	52	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
35	51	info	Giới thiệu Bến tàu chợ nổi	Khám phá không gian Bến tàu chợ nổi qua hình ảnh toàn cảnh.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
36	51	location	Vị trí Bến tàu chợ nổi	Tọa độ 10.010200, 105.751000. Không gian này thuộc Chợ nổi Cái Răng.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
37	52	navigation	Đi đến Bến tàu chợ nổi	Chuyển sang không gian 360 tại Bến tàu chợ nổi, cùng điểm đến Chợ nổi Cái Răng.	118.0000	-4.0000	51	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
38	52	info	Giới thiệu Khu ghe ẩm thực	Khám phá không gian Khu ghe ẩm thực qua hình ảnh toàn cảnh.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
39	52	location	Vị trí Khu ghe ẩm thực	Tọa độ 10.005500, 105.747400. Không gian này thuộc Chợ nổi Cái Răng.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
40	51	link	Khám phá Chợ nổi Cái Răng	Xem thông tin, hình ảnh và nội dung liên quan đến Chợ nổi Cái Răng.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/34	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
41	53	navigation	Đi đến Vườn lan Bình Thủy	Chuyển sang không gian 360 tại Vườn lan Bình Thủy, cùng điểm đến Nhà cổ Bình Thủy.	35.0000	-4.0000	54	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
42	53	info	Giới thiệu Nhà chính Bình Thủy	Khám phá không gian Nhà chính Bình Thủy qua hình ảnh toàn cảnh.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
43	53	location	Vị trí Nhà chính Bình Thủy	Tọa độ 10.061200, 105.758600. Không gian này thuộc Nhà cổ Bình Thủy.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
44	54	navigation	Đi đến Nhà chính Bình Thủy	Chuyển sang không gian 360 tại Nhà chính Bình Thủy, cùng điểm đến Nhà cổ Bình Thủy.	118.0000	-4.0000	53	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
45	54	info	Giới thiệu Vườn lan Bình Thủy	Khám phá không gian Vườn lan Bình Thủy qua hình ảnh toàn cảnh.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
46	54	location	Vị trí Vườn lan Bình Thủy	Tọa độ 10.061000, 105.758200. Không gian này thuộc Nhà cổ Bình Thủy.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
47	53	link	Khám phá Nhà cổ Bình Thủy	Xem thông tin, hình ảnh và nội dung liên quan đến Nhà cổ Bình Thủy.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/35	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
48	55	navigation	Đi đến Vườn thiền	Chuyển sang không gian 360 tại Vườn thiền, cùng điểm đến Thiền viện Trúc Lâm Phương Nam.	35.0000	-4.0000	56	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
49	55	info	Giới thiệu Chánh điện	Khám phá không gian Chánh điện qua hình ảnh toàn cảnh.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
50	55	location	Vị trí Chánh điện	Tọa độ 9.996100, 105.673700. Không gian này thuộc Thiền viện Trúc Lâm Phương Nam.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
51	56	navigation	Đi đến Chánh điện	Chuyển sang không gian 360 tại Chánh điện, cùng điểm đến Thiền viện Trúc Lâm Phương Nam.	118.0000	-4.0000	55	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
52	56	info	Giới thiệu Vườn thiền	Khám phá không gian Vườn thiền qua hình ảnh toàn cảnh.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
53	56	location	Vị trí Vườn thiền	Tọa độ 9.995800, 105.674100. Không gian này thuộc Thiền viện Trúc Lâm Phương Nam.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
54	55	link	Khám phá Thiền viện Trúc Lâm Phương Nam	Xem thông tin, hình ảnh và nội dung liên quan đến Thiền viện Trúc Lâm Phương Nam.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/36	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
55	57	navigation	Đi đến Khu làm bánh dân gian	Chuyển sang không gian 360 tại Khu làm bánh dân gian, cùng điểm đến Cồn Sơn.	35.0000	-4.0000	58	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
56	57	info	Giới thiệu Vườn trái cây Cồn Sơn	Khám phá không gian Vườn trái cây Cồn Sơn qua hình ảnh toàn cảnh.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
57	57	location	Vị trí Vườn trái cây Cồn Sơn	Tọa độ 10.115300, 105.735800. Không gian này thuộc Cồn Sơn.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
58	58	navigation	Đi đến Vườn trái cây Cồn Sơn	Chuyển sang không gian 360 tại Vườn trái cây Cồn Sơn, cùng điểm đến Cồn Sơn.	118.0000	-4.0000	57	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
59	58	info	Giới thiệu Khu làm bánh dân gian	Khám phá không gian Khu làm bánh dân gian qua hình ảnh toàn cảnh.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
60	58	location	Vị trí Khu làm bánh dân gian	Tọa độ 10.114800, 105.735400. Không gian này thuộc Cồn Sơn.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
61	57	link	Khám phá Cồn Sơn	Xem thông tin, hình ảnh và nội dung liên quan đến Cồn Sơn.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/37	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
62	119	navigation	Đi đến Nhà Thái Học	Chuyển sang không gian 360 tại Nhà Thái Học, cùng điểm đến Văn Miếu – Quốc Tử Giám.	35.0000	-4.0000	120	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
63	119	info	Giới thiệu Khuê Văn Các	Hình ảnh toàn cảnh tại Khuê Văn Các.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
64	119	location	Vị trí Khuê Văn Các	Tọa độ 21.028700, 105.835700. Không gian này thuộc Văn Miếu – Quốc Tử Giám.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
65	120	navigation	Đi đến Khuê Văn Các	Chuyển sang không gian 360 tại Khuê Văn Các, cùng điểm đến Văn Miếu – Quốc Tử Giám.	118.0000	-4.0000	119	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
66	120	info	Giới thiệu Nhà Thái Học	Hình ảnh toàn cảnh tại Nhà Thái Học.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
67	120	location	Vị trí Nhà Thái Học	Tọa độ 21.028900, 105.835900. Không gian này thuộc Văn Miếu – Quốc Tử Giám.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
68	119	link	Khám phá Văn Miếu – Quốc Tử Giám	Xem thông tin, hình ảnh và nội dung liên quan đến Văn Miếu – Quốc Tử Giám.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/68	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
69	121	navigation	Đi đến Khu khảo cổ 18 Hoàng Diệu	Chuyển sang không gian 360 tại Khu khảo cổ 18 Hoàng Diệu, cùng điểm đến Hoàng thành Thăng Long.	35.0000	-4.0000	122	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
70	121	info	Giới thiệu Đoan Môn	Hình ảnh toàn cảnh tại Đoan Môn.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
71	121	location	Vị trí Đoan Môn	Tọa độ 21.035400, 105.840500. Không gian này thuộc Hoàng thành Thăng Long.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
72	122	navigation	Đi đến Đoan Môn	Chuyển sang không gian 360 tại Đoan Môn, cùng điểm đến Hoàng thành Thăng Long.	118.0000	-4.0000	121	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
73	122	info	Giới thiệu Khu khảo cổ 18 Hoàng Diệu	Hình ảnh toàn cảnh tại Khu khảo cổ 18 Hoàng Diệu.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
74	122	location	Vị trí Khu khảo cổ 18 Hoàng Diệu	Tọa độ 21.035600, 105.840700. Không gian này thuộc Hoàng thành Thăng Long.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
75	121	link	Khám phá Hoàng thành Thăng Long	Xem thông tin, hình ảnh và nội dung liên quan đến Hoàng thành Thăng Long.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/69	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
76	123	navigation	Đi đến Điện Thái Hòa	Chuyển sang không gian 360 tại Điện Thái Hòa, cùng điểm đến Đại Nội Huế.	35.0000	-4.0000	124	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
77	123	info	Giới thiệu Ngọ Môn	Hình ảnh toàn cảnh tại Ngọ Môn.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
78	123	location	Vị trí Ngọ Môn	Tọa độ 16.469700, 107.578200. Không gian này thuộc Đại Nội Huế.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
79	124	navigation	Đi đến Ngọ Môn	Chuyển sang không gian 360 tại Ngọ Môn, cùng điểm đến Đại Nội Huế.	118.0000	-4.0000	123	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
80	124	info	Giới thiệu Điện Thái Hòa	Hình ảnh toàn cảnh tại Điện Thái Hòa.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
81	124	location	Vị trí Điện Thái Hòa	Tọa độ 16.469900, 107.578400. Không gian này thuộc Đại Nội Huế.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
82	123	link	Khám phá Đại Nội Huế	Xem thông tin, hình ảnh và nội dung liên quan đến Đại Nội Huế.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/70	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
83	125	navigation	Đi đến Điện Đại Hùng	Chuyển sang không gian 360 tại Điện Đại Hùng, cùng điểm đến Chùa Thiên Mụ.	35.0000	-4.0000	126	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
84	125	info	Giới thiệu Tháp Phước Duyên	Hình ảnh toàn cảnh tại Tháp Phước Duyên.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
85	125	location	Vị trí Tháp Phước Duyên	Tọa độ 16.453400, 107.545100. Không gian này thuộc Chùa Thiên Mụ.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
86	126	navigation	Đi đến Tháp Phước Duyên	Chuyển sang không gian 360 tại Tháp Phước Duyên, cùng điểm đến Chùa Thiên Mụ.	118.0000	-4.0000	125	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
87	126	info	Giới thiệu Điện Đại Hùng	Hình ảnh toàn cảnh tại Điện Đại Hùng.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
88	126	location	Vị trí Điện Đại Hùng	Tọa độ 16.453600, 107.545300. Không gian này thuộc Chùa Thiên Mụ.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
89	125	link	Khám phá Chùa Thiên Mụ	Xem thông tin, hình ảnh và nội dung liên quan đến Chùa Thiên Mụ.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/71	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
90	127	navigation	Đi đến Hội quán Phúc Kiến	Chuyển sang không gian 360 tại Hội quán Phúc Kiến, cùng điểm đến Phố cổ Hội An.	35.0000	-4.0000	128	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
91	127	info	Giới thiệu Chùa Cầu	Hình ảnh toàn cảnh tại Chùa Cầu.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
92	127	location	Vị trí Chùa Cầu	Tọa độ 15.880300, 108.338200. Không gian này thuộc Phố cổ Hội An.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
93	128	navigation	Đi đến Chùa Cầu	Chuyển sang không gian 360 tại Chùa Cầu, cùng điểm đến Phố cổ Hội An.	118.0000	-4.0000	127	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
94	128	info	Giới thiệu Hội quán Phúc Kiến	Hình ảnh toàn cảnh tại Hội quán Phúc Kiến.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
95	128	location	Vị trí Hội quán Phúc Kiến	Tọa độ 15.880500, 108.338400. Không gian này thuộc Phố cổ Hội An.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
96	127	link	Khám phá Phố cổ Hội An	Xem thông tin, hình ảnh và nội dung liên quan đến Phố cổ Hội An.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/72	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
97	129	navigation	Đi đến Làng Pháp	Chuyển sang không gian 360 tại Làng Pháp, cùng điểm đến Bà Nà Hills.	35.0000	-4.0000	130	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
98	129	info	Giới thiệu Cầu Vàng	Hình ảnh toàn cảnh tại Cầu Vàng.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
99	129	location	Vị trí Cầu Vàng	Tọa độ 15.997900, 107.988300. Không gian này thuộc Bà Nà Hills.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
100	130	navigation	Đi đến Cầu Vàng	Chuyển sang không gian 360 tại Cầu Vàng, cùng điểm đến Bà Nà Hills.	118.0000	-4.0000	129	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
101	130	info	Giới thiệu Làng Pháp	Hình ảnh toàn cảnh tại Làng Pháp.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
102	130	location	Vị trí Làng Pháp	Tọa độ 15.998100, 107.988500. Không gian này thuộc Bà Nà Hills.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
103	129	link	Khám phá Bà Nà Hills	Xem thông tin, hình ảnh và nội dung liên quan đến Bà Nà Hills.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/73	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
104	131	navigation	Đi đến Khu ẩm thực	Chuyển sang không gian 360 tại Khu ẩm thực, cùng điểm đến Chợ Bến Thành.	35.0000	-4.0000	132	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
105	131	info	Giới thiệu Cửa Nam	Hình ảnh toàn cảnh tại Cửa Nam.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
106	131	location	Vị trí Cửa Nam	Tọa độ 10.772700, 106.698200. Không gian này thuộc Chợ Bến Thành.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
107	132	navigation	Đi đến Cửa Nam	Chuyển sang không gian 360 tại Cửa Nam, cùng điểm đến Chợ Bến Thành.	118.0000	-4.0000	131	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
108	132	info	Giới thiệu Khu ẩm thực	Hình ảnh toàn cảnh tại Khu ẩm thực.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
109	132	location	Vị trí Khu ẩm thực	Tọa độ 10.772900, 106.698400. Không gian này thuộc Chợ Bến Thành.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
110	131	link	Khám phá Chợ Bến Thành	Xem thông tin, hình ảnh và nội dung liên quan đến Chợ Bến Thành.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/74	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
111	133	navigation	Đi đến Khu trưng bày nghệ thuật hiện đại	Chuyển sang không gian 360 tại Khu trưng bày nghệ thuật hiện đại, cùng điểm đến Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh.	35.0000	-4.0000	134	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
112	133	info	Giới thiệu Tòa nhà chính	Hình ảnh toàn cảnh tại Tòa nhà chính.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
113	133	location	Vị trí Tòa nhà chính	Tọa độ 10.770100, 106.700100. Không gian này thuộc Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
114	134	navigation	Đi đến Tòa nhà chính	Chuyển sang không gian 360 tại Tòa nhà chính, cùng điểm đến Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh.	118.0000	-4.0000	133	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
115	134	info	Giới thiệu Khu trưng bày nghệ thuật hiện đại	Hình ảnh toàn cảnh tại Khu trưng bày nghệ thuật hiện đại.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
116	134	location	Vị trí Khu trưng bày nghệ thuật hiện đại	Tọa độ 10.770300, 106.700300. Không gian này thuộc Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
117	133	link	Khám phá Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh	Xem thông tin, hình ảnh và nội dung liên quan đến Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/75	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
118	135	navigation	Đi đến Đỉnh Vân Sơn	Chuyển sang không gian 360 tại Đỉnh Vân Sơn, cùng điểm đến Núi Bà Đen.	35.0000	-4.0000	136	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
119	135	info	Giới thiệu Chùa Bà	Hình ảnh toàn cảnh tại Chùa Bà.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
120	135	location	Vị trí Chùa Bà	Tọa độ 11.371100, 106.172000. Không gian này thuộc Núi Bà Đen.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
121	136	navigation	Đi đến Chùa Bà	Chuyển sang không gian 360 tại Chùa Bà, cùng điểm đến Núi Bà Đen.	118.0000	-4.0000	135	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
122	136	info	Giới thiệu Đỉnh Vân Sơn	Hình ảnh toàn cảnh tại Đỉnh Vân Sơn.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
123	136	location	Vị trí Đỉnh Vân Sơn	Tọa độ 11.371300, 106.172200. Không gian này thuộc Núi Bà Đen.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
124	135	link	Khám phá Núi Bà Đen	Xem thông tin, hình ảnh và nội dung liên quan đến Núi Bà Đen.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/76	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
125	137	navigation	Đi đến Tuyến xuồng xuyên rừng	Chuyển sang không gian 360 tại Tuyến xuồng xuyên rừng, cùng điểm đến Vườn quốc gia Tràm Chim.	35.0000	-4.0000	138	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
126	137	info	Giới thiệu Trạm quan sát chim	Hình ảnh toàn cảnh tại Trạm quan sát chim.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
127	137	location	Vị trí Trạm quan sát chim	Tọa độ 10.725500, 105.516700. Không gian này thuộc Vườn quốc gia Tràm Chim.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
128	138	navigation	Đi đến Trạm quan sát chim	Chuyển sang không gian 360 tại Trạm quan sát chim, cùng điểm đến Vườn quốc gia Tràm Chim.	118.0000	-4.0000	137	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
129	138	info	Giới thiệu Tuyến xuồng xuyên rừng	Hình ảnh toàn cảnh tại Tuyến xuồng xuyên rừng.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
130	138	location	Vị trí Tuyến xuồng xuyên rừng	Tọa độ 10.725700, 105.516900. Không gian này thuộc Vườn quốc gia Tràm Chim.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
131	137	link	Khám phá Vườn quốc gia Tràm Chim	Xem thông tin, hình ảnh và nội dung liên quan đến Vườn quốc gia Tràm Chim.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/77	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
132	139	navigation	Đi đến Khu chèo kayak	Chuyển sang không gian 360 tại Khu chèo kayak, cùng điểm đến Bãi Sao Phú Quốc.	35.0000	-4.0000	140	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
133	139	info	Giới thiệu Bãi tắm trung tâm	Hình ảnh toàn cảnh tại Bãi tắm trung tâm.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
134	139	location	Vị trí Bãi tắm trung tâm	Tọa độ 10.058200, 104.037000. Không gian này thuộc Bãi Sao Phú Quốc.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
135	140	navigation	Đi đến Bãi tắm trung tâm	Chuyển sang không gian 360 tại Bãi tắm trung tâm, cùng điểm đến Bãi Sao Phú Quốc.	118.0000	-4.0000	139	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
136	140	info	Giới thiệu Khu chèo kayak	Hình ảnh toàn cảnh tại Khu chèo kayak.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
137	140	location	Vị trí Khu chèo kayak	Tọa độ 10.058400, 104.037200. Không gian này thuộc Bãi Sao Phú Quốc.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
138	139	link	Khám phá Bãi Sao Phú Quốc	Xem thông tin, hình ảnh và nội dung liên quan đến Bãi Sao Phú Quốc.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/78	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
139	141	navigation	Đi đến Khu tái hiện lịch sử	Chuyển sang không gian 360 tại Khu tái hiện lịch sử, cùng điểm đến Nhà tù Phú Quốc.	35.0000	-4.0000	142	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
140	141	info	Giới thiệu Nhà trưng bày	Hình ảnh toàn cảnh tại Nhà trưng bày.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
141	141	location	Vị trí Nhà trưng bày	Tọa độ 10.045500, 104.017400. Không gian này thuộc Nhà tù Phú Quốc.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
142	142	navigation	Đi đến Nhà trưng bày	Chuyển sang không gian 360 tại Nhà trưng bày, cùng điểm đến Nhà tù Phú Quốc.	118.0000	-4.0000	141	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
143	142	info	Giới thiệu Khu tái hiện lịch sử	Hình ảnh toàn cảnh tại Khu tái hiện lịch sử.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
144	142	location	Vị trí Khu tái hiện lịch sử	Tọa độ 10.045700, 104.017600. Không gian này thuộc Nhà tù Phú Quốc.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
145	141	link	Khám phá Nhà tù Phú Quốc	Xem thông tin, hình ảnh và nội dung liên quan đến Nhà tù Phú Quốc.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/79	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
146	143	navigation	Đi đến Khu hải sản	Chuyển sang không gian 360 tại Khu hải sản, cùng điểm đến Làng chài Hàm Ninh.	35.0000	-4.0000	144	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
147	143	info	Giới thiệu Cầu cảng Hàm Ninh	Hình ảnh toàn cảnh tại Cầu cảng Hàm Ninh.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
148	143	location	Vị trí Cầu cảng Hàm Ninh	Tọa độ 10.177000, 104.050000. Không gian này thuộc Làng chài Hàm Ninh.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
149	144	navigation	Đi đến Cầu cảng Hàm Ninh	Chuyển sang không gian 360 tại Cầu cảng Hàm Ninh, cùng điểm đến Làng chài Hàm Ninh.	118.0000	-4.0000	143	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
150	144	info	Giới thiệu Khu hải sản	Hình ảnh toàn cảnh tại Khu hải sản.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
151	144	location	Vị trí Khu hải sản	Tọa độ 10.177200, 104.050200. Không gian này thuộc Làng chài Hàm Ninh.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
152	143	link	Khám phá Làng chài Hàm Ninh	Xem thông tin, hình ảnh và nội dung liên quan đến Làng chài Hàm Ninh.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/80	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
153	145	navigation	Đi đến Tuyến cây cổ thụ	Chuyển sang không gian 360 tại Tuyến cây cổ thụ, cùng điểm đến Vườn quốc gia Cát Tiên.	35.0000	-4.0000	146	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
154	145	info	Giới thiệu Bàu Sấu	Hình ảnh toàn cảnh tại Bàu Sấu.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
155	145	location	Vị trí Bàu Sấu	Tọa độ 11.423700, 107.428300. Không gian này thuộc Vườn quốc gia Cát Tiên.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
156	146	navigation	Đi đến Bàu Sấu	Chuyển sang không gian 360 tại Bàu Sấu, cùng điểm đến Vườn quốc gia Cát Tiên.	118.0000	-4.0000	145	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
157	146	info	Giới thiệu Tuyến cây cổ thụ	Hình ảnh toàn cảnh tại Tuyến cây cổ thụ.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
158	146	location	Vị trí Tuyến cây cổ thụ	Tọa độ 11.423900, 107.428500. Không gian này thuộc Vườn quốc gia Cát Tiên.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
159	145	link	Khám phá Vườn quốc gia Cát Tiên	Xem thông tin, hình ảnh và nội dung liên quan đến Vườn quốc gia Cát Tiên.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/81	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
160	147	navigation	Đi đến Khán phòng	Chuyển sang không gian 360 tại Khán phòng, cùng điểm đến Nhà hát Thành phố Hồ Chí Minh.	35.0000	-4.0000	148	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
161	147	info	Giới thiệu Sảnh chính	Hình ảnh toàn cảnh tại Sảnh chính.	145.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
162	147	location	Vị trí Sảnh chính	Tọa độ 10.776700, 106.703200. Không gian này thuộc Nhà hát Thành phố Hồ Chí Minh.	255.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
163	148	navigation	Đi đến Sảnh chính	Chuyển sang không gian 360 tại Sảnh chính, cùng điểm đến Nhà hát Thành phố Hồ Chí Minh.	118.0000	-4.0000	147	\N	10	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
164	148	info	Giới thiệu Khán phòng	Hình ảnh toàn cảnh tại Khán phòng.	216.0000	8.0000	\N	\N	20	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
165	148	location	Vị trí Khán phòng	Tọa độ 10.776900, 106.703400. Không gian này thuộc Nhà hát Thành phố Hồ Chí Minh.	314.0000	-12.0000	\N	\N	30	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
166	147	link	Khám phá Nhà hát Thành phố Hồ Chí Minh	Xem thông tin, hình ảnh và nội dung liên quan đến Nhà hát Thành phố Hồ Chí Minh.	320.0000	5.0000	\N	https://travellens-fe.vercel.app/destinations/82	40	t	2026-07-22 11:29:51.416262	2026-07-22 11:29:51.416262	\N
\.


--
-- Data for Name: view360_image; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.view360_image (image_id, view_id, image_file, order_index, created_at, updated_at, deleted_at) FROM stdin;
126	121	https://s3.cloudfly.vn/travellens/view360-images/1784662850983-view-121-doan-mon.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:44.78363	\N
127	122	https://s3.cloudfly.vn/travellens/view360-images/1784662851839-view-122-hoang-dieu-archaeology.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:45.699373	\N
128	123	https://s3.cloudfly.vn/travellens/view360-images/1784662852749-view-123-ngo-mon-hue.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:46.563436	\N
7	6	https://s3.cloudfly.vn/travellens/view360-images/1784516090936-screenshot1.jpg	1	2026-07-20 09:54:54.244358	2026-07-20 09:57:31.577939	2026-07-20 09:57:31.577939
8	6	https://s3.cloudfly.vn/travellens/view360-images/1784515976791-screenshot1.jpg	1	2026-07-20 09:56:09.319432	2026-07-20 09:57:33.709003	2026-07-20 09:57:33.709003
11	2	https://s3.cloudfly.vn/travellens/view360-images/1784665248727-view-2-fpt-can-tho-gamma-building.png	1	2026-07-20 15:01:32.504638	2026-07-22 03:20:42.890811	\N
9	6	https://s3.cloudfly.vn/travellens/view360-images/1784516259925-ChatGPT-Image-09_56_43-20-thg-7-2026.png	1	2026-07-20 09:57:43.708189	2026-07-20 10:00:37.472475	2026-07-20 10:00:37.472475
3	3	https://s3.cloudfly.vn/travellens/view360-images/1784665249942-view-3-independence-palace-main-gate.png	1	2026-06-20 15:04:18.933714	2026-07-22 03:20:43.843491	\N
5	4	https://s3.cloudfly.vn/travellens/view360-images/1784665250887-view-4-nha-rong-wharf-river-courtyard.png	1	2026-06-24 07:40:54.141238	2026-07-22 03:20:44.715704	\N
6	5	https://s3.cloudfly.vn/travellens/view360-images/1784665251758-view-5-fpt-can-tho-introduction-area.png	1	2026-07-01 21:47:24.780378	2026-07-22 03:20:45.794791	\N
10	6	https://s3.cloudfly.vn/travellens/view360-images/1784665252850-view-6-fpt-can-tho-alpha-lobby.png	1	2026-07-20 10:01:02.042252	2026-07-22 03:20:46.590909	\N
154	149	https://s3.cloudfly.vn/travellens/view360-images/1784666079295-view-149-ong-de-folk-games-v2.png	1	2026-07-22 01:23:58.08909	2026-07-22 03:34:33.169771	\N
155	150	https://s3.cloudfly.vn/travellens/view360-images/1784666080216-view-150-independence-palace-reception-hall-v2.png	1	2026-07-22 01:23:59.475867	2026-07-22 03:34:34.145026	\N
1	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	1	2026-05-25 14:11:34.219139	2026-06-22 08:34:20.031758	2026-06-22 08:34:20.031758
4	1	https://s3.cloudfly.vn/travellens/locations/1781624144931-1e3fd15e0a7b9a0deca0f0da302df3a6.jpg	1	2026-06-22 08:34:27.872756	2026-06-23 19:58:10.472888	2026-06-23 19:58:10.472888
2	2	https://s3.cloudfly.vn/travellens/locations/1781623977782-0e04e76aedce4acc383c256e9fb7418c.jpg	1	2026-06-20 07:13:03.953324	2026-07-20 15:00:45.17435	2026-07-20 15:00:45.17435
54	49	https://s3.cloudfly.vn/travellens/view360-images/1784660554743-ninh-kieu-park-360-v2.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:02:45.047754	\N
55	50	https://s3.cloudfly.vn/travellens/view360-images/1784660572126-ninh-kieu-footbridge-360-v2.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:03:00.165491	\N
56	51	https://s3.cloudfly.vn/travellens/view360-images/1784661454812-view-51-cai-rang-floating-market-dock.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:17:28.628016	\N
57	52	https://s3.cloudfly.vn/travellens/view360-images/1784661455695-view-52-cai-rang-food-boats.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:17:29.607927	\N
58	53	https://s3.cloudfly.vn/travellens/view360-images/1784661456679-view-53-binh-thuy-main-house.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:17:30.496203	\N
59	54	https://s3.cloudfly.vn/travellens/view360-images/1784661457557-view-54-binh-thuy-orchid-garden.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:17:31.34121	\N
60	55	https://s3.cloudfly.vn/travellens/view360-images/1784662000634-view-55-truc-lam-phuong-nam-main-hall.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:26:35.378444	\N
61	56	https://s3.cloudfly.vn/travellens/view360-images/1784662002594-view-56-truc-lam-phuong-nam-zen-garden.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:26:37.887514	\N
62	57	https://s3.cloudfly.vn/travellens/view360-images/1784662004950-view-57-con-son-fruit-garden.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:26:39.070673	\N
63	58	https://s3.cloudfly.vn/travellens/view360-images/1784662006134-view-58-con-son-folk-cake-area.png	1	2026-07-22 00:08:34.293735	2026-07-22 02:26:40.214655	\N
124	119	https://s3.cloudfly.vn/travellens/view360-images/1784662849161-view-119-khue-van-cac.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:43.040352	\N
125	120	https://s3.cloudfly.vn/travellens/view360-images/1784662850098-view-120-temple-literature-thai-hoc.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:43.933339	\N
129	124	https://s3.cloudfly.vn/travellens/view360-images/1784662853612-view-124-thai-hoa-palace-hue.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:47.458371	\N
130	125	https://s3.cloudfly.vn/travellens/view360-images/1784662854510-view-125-phuoc-duyen-tower.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:48.370514	\N
131	126	https://s3.cloudfly.vn/travellens/view360-images/1784662855419-view-126-thien-mu-dai-hung-hall.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:40:49.321636	\N
132	127	https://s3.cloudfly.vn/travellens/view360-images/1784663619254-view-127-hoi-an-japanese-bridge.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:34.602799	\N
133	128	https://s3.cloudfly.vn/travellens/view360-images/1784663621649-view-128-hoi-an-fujian-assembly-hall.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:35.436832	\N
134	129	https://s3.cloudfly.vn/travellens/view360-images/1784663622481-view-129-ba-na-golden-bridge.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:36.276345	\N
135	130	https://s3.cloudfly.vn/travellens/view360-images/1784663623321-view-130-ba-na-french-village.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:37.127794	\N
136	131	https://s3.cloudfly.vn/travellens/view360-images/1784663624173-view-131-ben-thanh-south-gate.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:37.950074	\N
137	132	https://s3.cloudfly.vn/travellens/view360-images/1784663624990-view-132-ben-thanh-food-court.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:38.751791	\N
138	133	https://s3.cloudfly.vn/travellens/view360-images/1784663625792-view-133-hcm-fine-arts-main-building.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:39.623689	\N
139	134	https://s3.cloudfly.vn/travellens/view360-images/1784663626664-view-134-hcm-modern-art-gallery.png	1	2026-07-22 00:15:54.274445	2026-07-22 02:53:40.432147	\N
140	135	https://s3.cloudfly.vn/travellens/view360-images/1784664265275-view-135-ba-den-ba-temple.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:19.400296	\N
141	136	https://s3.cloudfly.vn/travellens/view360-images/1784664266443-view-136-ba-den-van-son-summit.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:20.167227	\N
142	137	https://s3.cloudfly.vn/travellens/view360-images/1784664267200-view-137-tram-chim-bird-observation.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:21.030641	\N
143	138	https://s3.cloudfly.vn/travellens/view360-images/1784664268099-view-138-tram-chim-forest-boat-route.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:22.140402	\N
144	139	https://s3.cloudfly.vn/travellens/view360-images/1784664269178-view-139-bai-sao-central-beach.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:22.919671	\N
145	140	https://s3.cloudfly.vn/travellens/view360-images/1784664269956-view-140-bai-sao-kayak-area.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:23.782004	\N
146	141	https://s3.cloudfly.vn/travellens/view360-images/1784664270837-view-141-phu-quoc-prison-museum.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:24.820472	\N
147	142	https://s3.cloudfly.vn/travellens/view360-images/1784664271932-view-142-phu-quoc-prison-reconstruction.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:04:25.704468	\N
148	143	https://s3.cloudfly.vn/travellens/view360-images/1784666073441-view-143-ham-ninh-pier.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:34:27.297549	\N
149	144	https://s3.cloudfly.vn/travellens/view360-images/1784666074351-view-144-ham-ninh-seafood-area.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:34:28.221651	\N
150	145	https://s3.cloudfly.vn/travellens/view360-images/1784666075265-view-145-cat-tien-bau-sau.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:34:29.205616	\N
151	146	https://s3.cloudfly.vn/travellens/view360-images/1784666076258-view-146-cat-tien-ancient-tree-trail.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:34:30.389638	\N
152	147	https://s3.cloudfly.vn/travellens/view360-images/1784666077435-view-147-saigon-opera-house-lobby.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:34:31.315742	\N
153	148	https://s3.cloudfly.vn/travellens/view360-images/1784666078361-view-148-saigon-opera-house-auditorium.png	1	2026-07-22 00:15:54.274445	2026-07-22 03:34:32.244775	\N
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-05-25 09:34:45
20211116045059	2026-05-25 09:34:46
20211116050929	2026-05-25 09:34:47
20211116051442	2026-05-25 09:34:47
20211116212300	2026-05-25 09:34:48
20211116213355	2026-05-25 09:34:49
20211116213934	2026-05-25 09:34:49
20211116214523	2026-05-25 09:34:50
20211122062447	2026-05-25 09:34:51
20211124070109	2026-05-25 09:34:52
20211202204204	2026-05-25 09:34:52
20211202204605	2026-05-25 09:34:53
20211210212804	2026-05-25 09:34:55
20211228014915	2026-05-25 09:34:56
20220107221237	2026-05-25 09:34:57
20220228202821	2026-05-25 09:34:57
20220312004840	2026-05-25 09:34:58
20220603231003	2026-05-25 09:34:59
20220603232444	2026-05-25 09:35:00
20220615214548	2026-05-25 09:35:01
20220712093339	2026-05-25 09:35:01
20220908172859	2026-05-25 09:35:02
20220916233421	2026-05-25 09:35:03
20230119133233	2026-05-25 09:35:03
20230128025114	2026-05-25 09:35:04
20230128025212	2026-05-25 09:35:05
20230227211149	2026-05-25 09:35:05
20230228184745	2026-05-25 09:35:06
20230308225145	2026-05-25 09:35:07
20230328144023	2026-05-25 09:35:08
20231018144023	2026-05-25 09:35:08
20231204144023	2026-05-25 09:35:09
20231204144024	2026-05-25 09:35:10
20231204144025	2026-05-25 09:35:11
20240108234812	2026-05-25 09:35:11
20240109165339	2026-05-25 09:35:12
20240227174441	2026-05-25 09:35:13
20240311171622	2026-05-25 09:35:14
20240321100241	2026-05-25 09:35:16
20240401105812	2026-05-25 09:35:18
20240418121054	2026-05-25 09:35:19
20240523004032	2026-05-25 09:35:21
20240618124746	2026-05-25 09:35:22
20240801235015	2026-05-25 09:35:22
20240805133720	2026-05-25 09:35:23
20240827160934	2026-05-25 09:35:24
20240919163303	2026-05-25 09:35:25
20240919163305	2026-05-25 09:35:25
20241019105805	2026-05-25 09:35:26
20241030150047	2026-05-25 09:35:29
20241108114728	2026-05-25 09:35:29
20241121104152	2026-05-25 09:35:30
20241130184212	2026-05-25 09:35:31
20241220035512	2026-05-25 09:35:32
20241220123912	2026-05-25 09:35:32
20241224161212	2026-05-25 09:35:33
20250107150512	2026-05-25 09:35:34
20250110162412	2026-05-25 09:35:34
20250123174212	2026-05-25 09:35:35
20250128220012	2026-05-25 09:35:36
20250506224012	2026-05-25 09:35:36
20250523164012	2026-05-25 09:35:37
20250714121412	2026-05-25 09:35:38
20250905041441	2026-05-25 09:35:38
20251103001201	2026-05-25 09:35:39
20251120212548	2026-05-25 09:35:40
20251120215549	2026-05-25 09:35:41
20260218120000	2026-05-25 09:35:41
20260326120000	2026-05-25 09:35:42
20260514120000	2026-06-04 06:22:04
20260527120000	2026-06-04 06:22:06
20260528120000	2026-06-04 06:22:07
20260603120000	2026-06-04 06:22:08
20260605120000	2026-06-16 12:45:53
20260606110000	2026-06-16 12:45:53
20260616120000	2026-06-29 07:04:57
20260624120000	2026-06-29 07:04:59
20260626120000	2026-07-02 16:18:03
20260706120000	2026-07-20 03:59:58
20260707120000	2026-07-20 04:00:02
20260709120000	2026-07-20 04:00:03
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter, selected_columns) FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-05-25 06:22:12.774997
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-05-25 06:22:12.784851
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-05-25 06:22:12.789382
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-05-25 06:22:12.805866
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-05-25 06:22:12.819187
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-05-25 06:22:12.824488
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-05-25 06:22:16.945664
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-05-25 06:22:16.973626
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-05-25 06:22:16.983211
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-05-25 06:22:16.996617
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-05-25 06:22:17.006209
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-05-25 06:22:17.014883
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-05-25 06:22:17.026586
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-05-25 06:22:17.033278
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-05-25 06:22:17.040323
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-05-25 06:22:17.084357
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-05-25 06:22:17.091309
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-05-25 06:22:17.099702
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-05-25 06:22:17.106464
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-05-25 06:22:17.115888
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-05-25 06:22:17.122387
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-05-25 06:22:17.130859
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-05-25 06:22:17.1504
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-05-25 06:22:17.161562
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-05-25 06:22:17.167805
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-05-25 06:22:17.174151
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-05-25 06:22:17.180734
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-05-25 06:22:17.18677
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-05-25 06:22:17.192767
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-05-25 06:22:17.198787
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-05-25 06:22:17.204859
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-05-25 06:22:17.210915
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-05-25 06:22:17.217025
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-05-25 06:22:17.225176
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-05-25 06:22:17.233941
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-05-25 06:22:17.240414
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-05-25 06:22:17.247972
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-05-25 06:22:17.254206
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-05-25 06:22:17.26168
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-05-25 06:22:17.27762
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-05-25 06:22:17.283656
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-05-25 06:22:17.295673
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-05-25 06:22:17.301879
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-05-25 06:22:17.30815
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-05-25 06:22:17.314484
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-05-25 06:22:17.321395
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-05-25 06:22:17.335134
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-05-25 06:22:17.342132
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-05-25 06:22:17.348492
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-05-25 06:22:17.365346
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-05-25 06:22:17.372198
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-05-25 06:22:17.723744
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-05-25 06:22:17.726149
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-05-25 06:22:17.736696
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-05-25 06:22:17.740238
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-05-25 06:22:17.742435
56	fix-optimized-search-function	b823ed1e418101032fa01374edc9a436e54e3ed4	2026-05-25 06:22:17.749106
57	s3-multipart-uploads-metadata	f127886e00d1b374fadbc7c6b31e09336aad5287	2026-05-25 06:22:17.756553
58	operation-ergonomics	00ca5d483b3fe0d522133d9002ccc5df98365120	2026-05-25 06:22:17.76274
59	drop-unused-functions	38456f13e39691c2bbb4b5151d0d1cdbabd4a8c4	2026-05-25 06:22:17.769492
60	optimize-existing-functions-again	db35e1c91a9201e59f4fef8d972c2f277d68b157	2026-05-25 06:22:17.775905
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata, metadata) FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- Name: ai_chat_history_chat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ai_chat_history_chat_id_seq', 1, false);


--
-- Name: ai_search_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ai_search_history_id_seq', 20, true);


--
-- Name: blog_blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_blog_id_seq', 49, true);


--
-- Name: blog_category_blog_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_category_blog_category_id_seq', 31, true);


--
-- Name: blog_comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_comment_comment_id_seq', 13, true);


--
-- Name: booking_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.booking_booking_id_seq', 189, true);


--
-- Name: booking_detail_booking_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.booking_detail_booking_detail_id_seq', 371, true);


--
-- Name: booking_status_history_booking_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.booking_status_history_booking_status_history_id_seq', 137, true);


--
-- Name: coupon_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coupon_coupon_id_seq', 31, true);


--
-- Name: destination_category_destination_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.destination_category_destination_category_id_seq', 37, true);


--
-- Name: email_verification_tokens_verification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_verification_tokens_verification_id_seq', 25, true);


--
-- Name: group_trip_group_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.group_trip_group_trip_id_seq', 22, true);


--
-- Name: group_trip_invite_group_trip_invite_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.group_trip_invite_group_trip_invite_id_seq', 16, true);


--
-- Name: group_trip_itinerary_item_itinerary_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.group_trip_itinerary_item_itinerary_item_id_seq', 10, true);


--
-- Name: group_trip_member_group_trip_member_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.group_trip_member_group_trip_member_id_seq', 39, true);


--
-- Name: location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.location_location_id_seq', 158, true);


--
-- Name: map_map_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.map_map_id_seq', 154, true);


--
-- Name: media_file_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.media_file_media_id_seq', 5, true);


--
-- Name: password_reset_codes_reset_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.password_reset_codes_reset_code_id_seq', 12, true);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 159, true);


--
-- Name: refund_request_refund_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refund_request_refund_request_id_seq', 18, true);


--
-- Name: review_photo_photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_photo_photo_id_seq', 7, true);


--
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_review_id_seq', 114, true);


--
-- Name: revoked_tokens_revoked_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.revoked_tokens_revoked_token_id_seq', 1, true);


--
-- Name: sepay_webhook_log_sepay_webhook_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sepay_webhook_log_sepay_webhook_log_id_seq', 32, true);


--
-- Name: statistics_stat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.statistics_stat_id_seq', 1, false);


--
-- Name: tour_category_tour_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tour_category_tour_category_id_seq', 38, true);


--
-- Name: tour_content_item_content_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tour_content_item_content_item_id_seq', 94, true);


--
-- Name: tour_destination_tour_destination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tour_destination_tour_destination_id_seq', 196, true);


--
-- Name: tour_tour_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tour_tour_id_seq', 86, true);


--
-- Name: travel_destination_destination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_destination_destination_id_seq', 82, true);


--
-- Name: travel_post_comment_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_post_comment_comment_id_seq', 199, true);


--
-- Name: travel_post_photo_photo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_post_photo_photo_id_seq', 108, true);


--
-- Name: travel_post_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_post_post_id_seq', 98, true);


--
-- Name: travel_post_report_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_post_report_report_id_seq', 10, true);


--
-- Name: travel_post_share_share_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_post_share_share_id_seq', 19, true);


--
-- Name: travel_story_story_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.travel_story_story_id_seq', 3, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 103, true);


--
-- Name: view360_hotspot_hotspot_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.view360_hotspot_hotspot_id_seq', 166, true);


--
-- Name: view360_image_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.view360_image_image_id_seq', 155, true);


--
-- Name: view360_view_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.view360_view_id_seq', 150, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- Name: ai_chat_history ai_chat_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_chat_history
    ADD CONSTRAINT ai_chat_history_pkey PRIMARY KEY (chat_id);


--
-- Name: ai_search_history ai_search_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_search_history
    ADD CONSTRAINT ai_search_history_pkey PRIMARY KEY (id);


--
-- Name: blog_blog_category blog_blog_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blog_category
    ADD CONSTRAINT blog_blog_category_pkey PRIMARY KEY (blog_id, blog_category_id);


--
-- Name: blog_category blog_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_category
    ADD CONSTRAINT blog_category_pkey PRIMARY KEY (blog_category_id);


--
-- Name: blog_comment blog_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comment
    ADD CONSTRAINT blog_comment_pkey PRIMARY KEY (comment_id);


--
-- Name: blog_location blog_location_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_location
    ADD CONSTRAINT blog_location_pkey PRIMARY KEY (blog_id, location_id);


--
-- Name: blog blog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (blog_id);


--
-- Name: booking_detail booking_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_detail
    ADD CONSTRAINT booking_detail_pkey PRIMARY KEY (booking_detail_id);


--
-- Name: booking booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT booking_pkey PRIMARY KEY (booking_id);


--
-- Name: booking_status_history booking_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT booking_status_history_pkey PRIMARY KEY (booking_status_history_id);


--
-- Name: coupon coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT coupon_pkey PRIMARY KEY (coupon_id);


--
-- Name: destination_category destination_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination_category
    ADD CONSTRAINT destination_category_pkey PRIMARY KEY (destination_category_id);


--
-- Name: email_verification_tokens email_verification_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_pkey PRIMARY KEY (verification_id);


--
-- Name: email_verification_tokens email_verification_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: group_trip_invite group_trip_invite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_invite
    ADD CONSTRAINT group_trip_invite_pkey PRIMARY KEY (group_trip_invite_id);


--
-- Name: group_trip_invite group_trip_invite_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_invite
    ADD CONSTRAINT group_trip_invite_token_hash_key UNIQUE (token_hash);


--
-- Name: group_trip_itinerary_item group_trip_itinerary_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_itinerary_item
    ADD CONSTRAINT group_trip_itinerary_item_pkey PRIMARY KEY (itinerary_item_id);


--
-- Name: group_trip_member group_trip_member_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_member
    ADD CONSTRAINT group_trip_member_pkey PRIMARY KEY (group_trip_member_id);


--
-- Name: group_trip group_trip_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip
    ADD CONSTRAINT group_trip_pkey PRIMARY KEY (group_trip_id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (location_id);


--
-- Name: map map_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map
    ADD CONSTRAINT map_pkey PRIMARY KEY (map_id);


--
-- Name: media_file media_file_file_url_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_file
    ADD CONSTRAINT media_file_file_url_key UNIQUE (file_url);


--
-- Name: media_file media_file_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_file
    ADD CONSTRAINT media_file_pkey PRIMARY KEY (media_id);


--
-- Name: password_reset_codes password_reset_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_pkey PRIMARY KEY (reset_code_id);


--
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- Name: tour_content_item_link pk_tour_content_item_link; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item_link
    ADD CONSTRAINT pk_tour_content_item_link PRIMARY KEY (tour_id, sort_order);


--
-- Name: travel_story_view pk_travel_story_view; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_story_view
    ADD CONSTRAINT pk_travel_story_view PRIMARY KEY (story_id, viewer_id);


--
-- Name: refund_request refund_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request
    ADD CONSTRAINT refund_request_pkey PRIMARY KEY (refund_request_id);


--
-- Name: review_photo review_photo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_photo
    ADD CONSTRAINT review_photo_pkey PRIMARY KEY (photo_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (review_id);


--
-- Name: revoked_tokens revoked_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revoked_tokens
    ADD CONSTRAINT revoked_tokens_pkey PRIMARY KEY (revoked_token_id);


--
-- Name: revoked_tokens revoked_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revoked_tokens
    ADD CONSTRAINT revoked_tokens_token_hash_key UNIQUE (token_hash);


--
-- Name: saved_destination saved_destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_destination
    ADD CONSTRAINT saved_destination_pkey PRIMARY KEY (user_id, destination_id);


--
-- Name: saved_tour saved_tour_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_tour
    ADD CONSTRAINT saved_tour_pkey PRIMARY KEY (user_id, tour_id);


--
-- Name: sepay_webhook_log sepay_webhook_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sepay_webhook_log
    ADD CONSTRAINT sepay_webhook_log_pkey PRIMARY KEY (sepay_webhook_log_id);


--
-- Name: sepay_webhook_log sepay_webhook_log_sepay_transaction_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sepay_webhook_log
    ADD CONSTRAINT sepay_webhook_log_sepay_transaction_id_key UNIQUE (sepay_transaction_id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (stat_id);


--
-- Name: tour_category tour_category_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_category
    ADD CONSTRAINT tour_category_pkey PRIMARY KEY (tour_category_id);


--
-- Name: tour_content_item tour_content_item_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item
    ADD CONSTRAINT tour_content_item_pkey PRIMARY KEY (content_item_id);


--
-- Name: tour_destination tour_destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_destination
    ADD CONSTRAINT tour_destination_pkey PRIMARY KEY (tour_destination_id);


--
-- Name: tour tour_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour
    ADD CONSTRAINT tour_pkey PRIMARY KEY (tour_id);


--
-- Name: travel_destination travel_destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_destination
    ADD CONSTRAINT travel_destination_pkey PRIMARY KEY (destination_id);


--
-- Name: travel_post_comment travel_post_comment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_comment
    ADD CONSTRAINT travel_post_comment_pkey PRIMARY KEY (comment_id);


--
-- Name: travel_post_like travel_post_like_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_like
    ADD CONSTRAINT travel_post_like_pkey PRIMARY KEY (post_id, user_id);


--
-- Name: travel_post_photo travel_post_photo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_photo
    ADD CONSTRAINT travel_post_photo_pkey PRIMARY KEY (photo_id);


--
-- Name: travel_post travel_post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post
    ADD CONSTRAINT travel_post_pkey PRIMARY KEY (post_id);


--
-- Name: travel_post_report travel_post_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_report
    ADD CONSTRAINT travel_post_report_pkey PRIMARY KEY (report_id);


--
-- Name: travel_post_share travel_post_share_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_share
    ADD CONSTRAINT travel_post_share_pkey PRIMARY KEY (share_id);


--
-- Name: travel_story travel_story_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_story
    ADD CONSTRAINT travel_story_pkey PRIMARY KEY (story_id);


--
-- Name: blog_category uq_blog_category_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_category
    ADD CONSTRAINT uq_blog_category_name UNIQUE (name);


--
-- Name: group_trip_member uq_group_trip_member_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_member
    ADD CONSTRAINT uq_group_trip_member_user UNIQUE (group_trip_id, user_id);


--
-- Name: tour_content_item_link uq_tour_content_item_link_item; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item_link
    ADD CONSTRAINT uq_tour_content_item_link_item UNIQUE (tour_id, content_item_id);


--
-- Name: tour_destination uq_tour_destination_destination; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_destination
    ADD CONSTRAINT uq_tour_destination_destination UNIQUE (tour_id, destination_id);


--
-- Name: tour_destination uq_tour_destination_order; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_destination
    ADD CONSTRAINT uq_tour_destination_order UNIQUE (tour_id, order_index);


--
-- Name: travel_post_report uq_travel_post_report_user_post; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_report
    ADD CONSTRAINT uq_travel_post_report_user_post UNIQUE (post_id, user_id);


--
-- Name: user_block user_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT user_block_pkey PRIMARY KEY (blocker_id, blocked_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: view360_hotspot view360_hotspot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_hotspot
    ADD CONSTRAINT view360_hotspot_pkey PRIMARY KEY (hotspot_id);


--
-- Name: view360_image view360_image_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_image
    ADD CONSTRAINT view360_image_pkey PRIMARY KEY (image_id);


--
-- Name: view360 view360_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360
    ADD CONSTRAINT view360_pkey PRIMARY KEY (view_id);


--
-- Name: messages messages_payload_exclusive; Type: CHECK CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages
    ADD CONSTRAINT messages_payload_exclusive CHECK (((payload IS NULL) OR (binary_payload IS NULL))) NOT VALID;


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: idx_users_created_at_desc; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_created_at_desc ON auth.users USING btree (created_at DESC);


--
-- Name: idx_users_email; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_email ON auth.users USING btree (email);


--
-- Name: idx_users_last_sign_in_at_desc; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_last_sign_in_at_desc ON auth.users USING btree (last_sign_in_at DESC);


--
-- Name: idx_users_name; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_users_name ON auth.users USING btree (((raw_user_meta_data ->> 'name'::text))) WHERE ((raw_user_meta_data ->> 'name'::text) IS NOT NULL);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- Name: idx_ai_chat_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_chat_history_created_at ON public.ai_chat_history USING btree (created_at);


--
-- Name: idx_ai_chat_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ai_chat_history_user_id ON public.ai_chat_history USING btree (user_id);


--
-- Name: idx_blog_blog_category_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_blog_category_category_id ON public.blog_blog_category USING btree (blog_category_id);


--
-- Name: idx_blog_comment_blog_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_comment_blog_id ON public.blog_comment USING btree (blog_id);


--
-- Name: idx_blog_comment_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_comment_deleted_at ON public.blog_comment USING btree (deleted_at);


--
-- Name: idx_blog_comment_parent_comment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_comment_parent_comment_id ON public.blog_comment USING btree (parent_comment_id);


--
-- Name: idx_blog_comment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_comment_status ON public.blog_comment USING btree (status);


--
-- Name: idx_blog_comment_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_comment_user_id ON public.blog_comment USING btree (user_id);


--
-- Name: idx_blog_location_blog_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_location_blog_id ON public.blog_location USING btree (blog_id);


--
-- Name: idx_blog_location_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_location_location_id ON public.blog_location USING btree (location_id);


--
-- Name: idx_blog_slug_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_blog_slug_unique ON public.blog USING btree (lower((slug)::text));


--
-- Name: idx_blog_status_published_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_status_published_at ON public.blog USING btree (status, published_at DESC);


--
-- Name: idx_blog_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_user_id ON public.blog USING btree (user_id);


--
-- Name: idx_booking_canceled_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_canceled_at ON public.booking USING btree (canceled_at);


--
-- Name: idx_booking_canceled_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_canceled_by ON public.booking USING btree (canceled_by);


--
-- Name: idx_booking_coupon_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_coupon_id ON public.booking USING btree (coupon_id);


--
-- Name: idx_booking_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_created_at ON public.booking USING btree (created_at);


--
-- Name: idx_booking_departure_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_departure_at ON public.booking USING btree (departure_at);


--
-- Name: idx_booking_detail_booking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_detail_booking_id ON public.booking_detail USING btree (booking_id);


--
-- Name: idx_booking_status_history_action; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_status_history_action ON public.booking_status_history USING btree (action);


--
-- Name: idx_booking_status_history_booking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_status_history_booking_id ON public.booking_status_history USING btree (booking_id);


--
-- Name: idx_booking_status_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_status_history_created_at ON public.booking_status_history USING btree (created_at);


--
-- Name: idx_booking_tour_departure_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_tour_departure_at ON public.booking USING btree (tour_id, departure_at);


--
-- Name: idx_booking_tour_departure_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_tour_departure_status ON public.booking USING btree (tour_id, departure_at, status);


--
-- Name: idx_booking_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_tour_id ON public.booking USING btree (tour_id);


--
-- Name: idx_booking_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_booking_user_id ON public.booking USING btree (user_id);


--
-- Name: idx_coupon_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coupon_code ON public.coupon USING btree (code);


--
-- Name: idx_coupon_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coupon_deleted_at ON public.coupon USING btree (deleted_at);


--
-- Name: idx_coupon_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coupon_status ON public.coupon USING btree (status);


--
-- Name: idx_destination_category_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_destination_category_name_unique ON public.destination_category USING btree (name);


--
-- Name: idx_email_verification_tokens_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_tokens_token_hash ON public.email_verification_tokens USING btree (token_hash);


--
-- Name: idx_email_verification_tokens_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_verification_tokens_user_id ON public.email_verification_tokens USING btree (user_id);


--
-- Name: idx_group_trip_invite_trip_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_trip_invite_trip_status ON public.group_trip_invite USING btree (group_trip_id, status, created_at DESC);


--
-- Name: idx_group_trip_invite_user_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_trip_invite_user_status ON public.group_trip_invite USING btree (invited_user_id, status);


--
-- Name: idx_group_trip_itinerary_trip_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_trip_itinerary_trip_date ON public.group_trip_itinerary_item USING btree (group_trip_id, itinerary_date, order_index);


--
-- Name: idx_group_trip_member_user_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_trip_member_user_status ON public.group_trip_member USING btree (user_id, status);


--
-- Name: idx_group_trip_not_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_group_trip_not_deleted ON public.group_trip USING btree (group_trip_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_location_coordinates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_location_coordinates ON public.location USING btree (latitude, longitude);


--
-- Name: idx_location_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_location_created_at ON public.location USING btree (created_at);


--
-- Name: idx_location_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_location_deleted_at ON public.location USING btree (deleted_at);


--
-- Name: idx_location_destination_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_location_destination_id ON public.location USING btree (destination_id);


--
-- Name: idx_location_destination_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_location_destination_name_unique ON public.location USING btree (destination_id, lower((name)::text)) WHERE (is_deleted = false);


--
-- Name: idx_map_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_deleted_at ON public.map USING btree (deleted_at);


--
-- Name: idx_map_is_deleted; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_is_deleted ON public.map USING btree (is_deleted);


--
-- Name: idx_map_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_location_id ON public.map USING btree (location_id);


--
-- Name: idx_media_file_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_file_created_at ON public.media_file USING btree (created_at DESC);


--
-- Name: idx_media_file_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_file_deleted_at ON public.media_file USING btree (deleted_at);


--
-- Name: idx_media_file_uploaded_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_media_file_uploaded_by ON public.media_file USING btree (uploaded_by);


--
-- Name: idx_password_reset_codes_code_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_codes_code_hash ON public.password_reset_codes USING btree (code_hash);


--
-- Name: idx_password_reset_codes_reset_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_codes_reset_token_hash ON public.password_reset_codes USING btree (reset_token_hash);


--
-- Name: idx_password_reset_codes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_password_reset_codes_user_id ON public.password_reset_codes USING btree (user_id);


--
-- Name: idx_payment_booking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_booking_id ON public.payment USING btree (booking_id);


--
-- Name: idx_payment_payment_code_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_payment_payment_code_unique ON public.payment USING btree (payment_code);


--
-- Name: idx_payment_sepay_transaction_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_payment_sepay_transaction_unique ON public.payment USING btree (sepay_transaction_id) WHERE (sepay_transaction_id IS NOT NULL);


--
-- Name: idx_payment_status_expired_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_status_expired_at ON public.payment USING btree (status, expired_at);


--
-- Name: idx_refund_request_active_booking; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_refund_request_active_booking ON public.refund_request USING btree (booking_id) WHERE ((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying])::text[]));


--
-- Name: idx_refund_request_payment_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refund_request_payment_id ON public.refund_request USING btree (payment_id);


--
-- Name: idx_refund_request_requested_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refund_request_requested_by ON public.refund_request USING btree (requested_by);


--
-- Name: idx_refund_request_reviewed_by; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refund_request_reviewed_by ON public.refund_request USING btree (reviewed_by);


--
-- Name: idx_refund_request_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_refund_request_status ON public.refund_request USING btree (status);


--
-- Name: idx_review_booking_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_booking_id ON public.review USING btree (booking_id);


--
-- Name: idx_review_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_deleted_at ON public.review USING btree (deleted_at);


--
-- Name: idx_review_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_location_id ON public.review USING btree (location_id);


--
-- Name: idx_review_photo_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_photo_deleted_at ON public.review_photo USING btree (deleted_at);


--
-- Name: idx_review_photo_review_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_photo_review_id ON public.review_photo USING btree (review_id);


--
-- Name: idx_review_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_tour_id ON public.review USING btree (tour_id);


--
-- Name: idx_review_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_user_id ON public.review USING btree (user_id);


--
-- Name: idx_review_user_location_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_review_user_location_unique ON public.review USING btree (user_id, location_id) WHERE (deleted_at IS NULL);


--
-- Name: idx_revoked_tokens_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_revoked_tokens_expires_at ON public.revoked_tokens USING btree (expires_at);


--
-- Name: idx_revoked_tokens_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_revoked_tokens_token_hash ON public.revoked_tokens USING btree (token_hash);


--
-- Name: idx_saved_destination_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_destination_user_id ON public.saved_destination USING btree (user_id);


--
-- Name: idx_saved_tour_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_saved_tour_user_id ON public.saved_tour USING btree (user_id);


--
-- Name: idx_sepay_webhook_log_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sepay_webhook_log_created_at ON public.sepay_webhook_log USING btree (created_at);


--
-- Name: idx_sepay_webhook_log_payment_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sepay_webhook_log_payment_code ON public.sepay_webhook_log USING btree (payment_code);


--
-- Name: idx_tour_category_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_tour_category_name_unique ON public.tour_category USING btree (name);


--
-- Name: idx_tour_content_item_link_source; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_content_item_link_source ON public.tour_content_item_link USING btree (source_content_item_id);


--
-- Name: idx_tour_content_item_type_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_content_item_type_status ON public.tour_content_item USING btree (type, status) WHERE (deleted_at IS NULL);


--
-- Name: idx_tour_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_created_at ON public.tour USING btree (created_at);


--
-- Name: idx_tour_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_deleted_at ON public.tour USING btree (deleted_at);


--
-- Name: idx_tour_destination_destination_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_destination_destination_id ON public.tour_destination USING btree (destination_id);


--
-- Name: idx_tour_destination_tour_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_destination_tour_id ON public.tour_destination USING btree (tour_id);


--
-- Name: idx_tour_start_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_start_at ON public.tour USING btree (start_at);


--
-- Name: idx_tour_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_status ON public.tour USING btree (status);


--
-- Name: idx_tour_tour_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tour_tour_category_id ON public.tour USING btree (tour_category_id);


--
-- Name: idx_travel_destination_coordinates; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_destination_coordinates ON public.travel_destination USING btree (latitude, longitude);


--
-- Name: idx_travel_destination_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_destination_deleted_at ON public.travel_destination USING btree (deleted_at);


--
-- Name: idx_travel_destination_destination_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_destination_destination_category_id ON public.travel_destination USING btree (destination_category_id);


--
-- Name: idx_travel_destination_name_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_travel_destination_name_unique ON public.travel_destination USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_travel_post_comment_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_comment_deleted_at ON public.travel_post_comment USING btree (deleted_at);


--
-- Name: idx_travel_post_comment_parent_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_comment_parent_id ON public.travel_post_comment USING btree (parent_comment_id);


--
-- Name: idx_travel_post_comment_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_comment_post_id ON public.travel_post_comment USING btree (post_id);


--
-- Name: idx_travel_post_comment_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_comment_user_id ON public.travel_post_comment USING btree (user_id);


--
-- Name: idx_travel_post_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_deleted_at ON public.travel_post USING btree (deleted_at);


--
-- Name: idx_travel_post_destination_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_destination_id ON public.travel_post USING btree (destination_id);


--
-- Name: idx_travel_post_like_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_like_user_id ON public.travel_post_like USING btree (user_id);


--
-- Name: idx_travel_post_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_location_id ON public.travel_post USING btree (location_id);


--
-- Name: idx_travel_post_photo_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_photo_deleted_at ON public.travel_post_photo USING btree (deleted_at);


--
-- Name: idx_travel_post_photo_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_photo_post_id ON public.travel_post_photo USING btree (post_id);


--
-- Name: idx_travel_post_report_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_report_post_id ON public.travel_post_report USING btree (post_id);


--
-- Name: idx_travel_post_report_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_report_status ON public.travel_post_report USING btree (status);


--
-- Name: idx_travel_post_report_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_report_user_id ON public.travel_post_report USING btree (user_id);


--
-- Name: idx_travel_post_share_platform; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_share_platform ON public.travel_post_share USING btree (platform);


--
-- Name: idx_travel_post_share_post_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_share_post_id ON public.travel_post_share USING btree (post_id);


--
-- Name: idx_travel_post_share_recent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_share_recent ON public.travel_post_share USING btree (post_id, user_id, platform, created_at DESC);


--
-- Name: idx_travel_post_share_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_share_user_id ON public.travel_post_share USING btree (user_id);


--
-- Name: idx_travel_post_status_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_status_created_at ON public.travel_post USING btree (status, created_at DESC);


--
-- Name: idx_travel_post_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_user_id ON public.travel_post USING btree (user_id);


--
-- Name: idx_travel_post_visibility; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_post_visibility ON public.travel_post USING btree (visibility);


--
-- Name: idx_travel_story_active_feed; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_story_active_feed ON public.travel_story USING btree (created_at DESC) WHERE (((status)::text = 'active'::text) AND (deleted_at IS NULL));


--
-- Name: idx_travel_story_expires_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_story_expires_at ON public.travel_story USING btree (expires_at);


--
-- Name: idx_travel_story_user_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_travel_story_user_created ON public.travel_story USING btree (user_id, created_at DESC);


--
-- Name: idx_user_block_blocked_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_block_blocked_id ON public.user_block USING btree (blocked_id);


--
-- Name: idx_view360_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_deleted_at ON public.view360 USING btree (deleted_at);


--
-- Name: idx_view360_hotspot_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_hotspot_deleted_at ON public.view360_hotspot USING btree (deleted_at);


--
-- Name: idx_view360_hotspot_target_view360_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_hotspot_target_view360_id ON public.view360_hotspot USING btree (target_view360_id);


--
-- Name: idx_view360_hotspot_view360_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_hotspot_view360_id ON public.view360_hotspot USING btree (view360_id);


--
-- Name: idx_view360_image_deleted_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_image_deleted_at ON public.view360_image USING btree (deleted_at);


--
-- Name: idx_view360_image_view_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_image_view_id ON public.view360_image USING btree (view_id);


--
-- Name: idx_view360_location_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_view360_location_id ON public.view360 USING btree (location_id);


--
-- Name: uq_coupon_active_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_coupon_active_code ON public.coupon USING btree (upper((code)::text)) WHERE (deleted_at IS NULL);


--
-- Name: uq_group_trip_active_leader; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_group_trip_active_leader ON public.group_trip_member USING btree (group_trip_id) WHERE (((role)::text = 'leader'::text) AND ((status)::text = 'active'::text));


--
-- Name: uq_group_trip_pending_invite; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_group_trip_pending_invite ON public.group_trip_invite USING btree (group_trip_id, invited_user_id) WHERE ((status)::text = 'pending'::text);


--
-- Name: uq_review_active_booking; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_review_active_booking ON public.review USING btree (booking_id) WHERE ((booking_id IS NOT NULL) AND (deleted_at IS NULL));


--
-- Name: uq_tour_content_item_type_normalized_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_tour_content_item_type_normalized_active ON public.tour_content_item USING btree (type, normalized_content) WHERE (deleted_at IS NULL);


--
-- Name: uq_tour_slug_active; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_tour_slug_active ON public.tour USING btree (lower((slug)::text)) WHERE (deleted_at IS NULL);


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- Name: subscription_subscription_id_entity_filters_action_filter_selec; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_selec ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter, COALESCE(selected_columns, '{}'::text[]));


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: ai_search_history ai_search_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_search_history
    ADD CONSTRAINT ai_search_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: coupon coupon_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT coupon_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: email_verification_tokens email_verification_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_tokens
    ADD CONSTRAINT email_verification_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: ai_chat_history fk_ai_chat_history_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_chat_history
    ADD CONSTRAINT fk_ai_chat_history_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: blog_blog_category fk_blog_blog_category_blog; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blog_category
    ADD CONSTRAINT fk_blog_blog_category_blog FOREIGN KEY (blog_id) REFERENCES public.blog(blog_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_blog_category fk_blog_blog_category_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_blog_category
    ADD CONSTRAINT fk_blog_blog_category_category FOREIGN KEY (blog_category_id) REFERENCES public.blog_category(blog_category_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: blog_comment fk_blog_comment_blog; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comment
    ADD CONSTRAINT fk_blog_comment_blog FOREIGN KEY (blog_id) REFERENCES public.blog(blog_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_comment fk_blog_comment_parent; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comment
    ADD CONSTRAINT fk_blog_comment_parent FOREIGN KEY (parent_comment_id) REFERENCES public.blog_comment(comment_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_comment fk_blog_comment_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_comment
    ADD CONSTRAINT fk_blog_comment_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_location fk_blog_location_blog; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_location
    ADD CONSTRAINT fk_blog_location_blog FOREIGN KEY (blog_id) REFERENCES public.blog(blog_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog_location fk_blog_location_location; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_location
    ADD CONSTRAINT fk_blog_location_location FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blog fk_blog_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog
    ADD CONSTRAINT fk_blog_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: booking fk_booking_canceled_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_booking_canceled_by FOREIGN KEY (canceled_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: booking fk_booking_coupon; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_booking_coupon FOREIGN KEY (coupon_id) REFERENCES public.coupon(coupon_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: booking_detail fk_booking_detail_booking; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_detail
    ADD CONSTRAINT fk_booking_detail_booking FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: booking_status_history fk_booking_status_history_booking; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT fk_booking_status_history_booking FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: booking_status_history fk_booking_status_history_changed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking_status_history
    ADD CONSTRAINT fk_booking_status_history_changed_by FOREIGN KEY (changed_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: booking fk_booking_tour; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_booking_tour FOREIGN KEY (tour_id) REFERENCES public.tour(tour_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: booking fk_booking_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.booking
    ADD CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: coupon fk_coupon_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupon
    ADD CONSTRAINT fk_coupon_created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: group_trip fk_group_trip_booking; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip
    ADD CONSTRAINT fk_group_trip_booking FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_trip fk_group_trip_created_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip
    ADD CONSTRAINT fk_group_trip_created_by FOREIGN KEY (created_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: group_trip fk_group_trip_destination; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip
    ADD CONSTRAINT fk_group_trip_destination FOREIGN KEY (destination_id) REFERENCES public.travel_destination(destination_id) ON DELETE SET NULL;


--
-- Name: group_trip_invite fk_group_trip_invite_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_invite
    ADD CONSTRAINT fk_group_trip_invite_by FOREIGN KEY (invited_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_trip_invite fk_group_trip_invite_trip; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_invite
    ADD CONSTRAINT fk_group_trip_invite_trip FOREIGN KEY (group_trip_id) REFERENCES public.group_trip(group_trip_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_trip_invite fk_group_trip_invite_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_invite
    ADD CONSTRAINT fk_group_trip_invite_user FOREIGN KEY (invited_user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_trip_itinerary_item fk_group_trip_itinerary_location; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_itinerary_item
    ADD CONSTRAINT fk_group_trip_itinerary_location FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE SET NULL;


--
-- Name: group_trip_itinerary_item fk_group_trip_itinerary_trip; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_itinerary_item
    ADD CONSTRAINT fk_group_trip_itinerary_trip FOREIGN KEY (group_trip_id) REFERENCES public.group_trip(group_trip_id) ON DELETE CASCADE;


--
-- Name: group_trip fk_group_trip_leader; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip
    ADD CONSTRAINT fk_group_trip_leader FOREIGN KEY (leader_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: group_trip_member fk_group_trip_member_removed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_member
    ADD CONSTRAINT fk_group_trip_member_removed_by FOREIGN KEY (removed_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: group_trip_member fk_group_trip_member_trip; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_member
    ADD CONSTRAINT fk_group_trip_member_trip FOREIGN KEY (group_trip_id) REFERENCES public.group_trip(group_trip_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_trip_member fk_group_trip_member_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_trip_member
    ADD CONSTRAINT fk_group_trip_member_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: location fk_location_destination; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT fk_location_destination FOREIGN KEY (destination_id) REFERENCES public.travel_destination(destination_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map fk_map_location; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map
    ADD CONSTRAINT fk_map_location FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: media_file fk_media_file_uploaded_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media_file
    ADD CONSTRAINT fk_media_file_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payment fk_payment_booking; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund_request fk_refund_request_booking; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request
    ADD CONSTRAINT fk_refund_request_booking FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund_request fk_refund_request_completed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request
    ADD CONSTRAINT fk_refund_request_completed_by FOREIGN KEY (completed_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: refund_request fk_refund_request_payment; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request
    ADD CONSTRAINT fk_refund_request_payment FOREIGN KEY (payment_id) REFERENCES public.payment(payment_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: refund_request fk_refund_request_requested_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request
    ADD CONSTRAINT fk_refund_request_requested_by FOREIGN KEY (requested_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: refund_request fk_refund_request_reviewed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refund_request
    ADD CONSTRAINT fk_refund_request_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: review fk_review_booking; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES public.booking(booking_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review fk_review_location; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT fk_review_location FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review_photo fk_review_photo_review; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_photo
    ADD CONSTRAINT fk_review_photo_review FOREIGN KEY (review_id) REFERENCES public.review(review_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review fk_review_tour; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT fk_review_tour FOREIGN KEY (tour_id) REFERENCES public.tour(tour_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: review fk_review_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: revoked_tokens fk_revoked_tokens_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.revoked_tokens
    ADD CONSTRAINT fk_revoked_tokens_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tour_content_item_link fk_tour_content_item_link_item; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item_link
    ADD CONSTRAINT fk_tour_content_item_link_item FOREIGN KEY (content_item_id) REFERENCES public.tour_content_item(content_item_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tour_content_item_link fk_tour_content_item_link_source; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item_link
    ADD CONSTRAINT fk_tour_content_item_link_source FOREIGN KEY (source_content_item_id) REFERENCES public.tour_content_item(content_item_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: tour_content_item_link fk_tour_content_item_link_tour; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_content_item_link
    ADD CONSTRAINT fk_tour_content_item_link_tour FOREIGN KEY (tour_id) REFERENCES public.tour(tour_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tour_destination fk_tour_destination_destination; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_destination
    ADD CONSTRAINT fk_tour_destination_destination FOREIGN KEY (destination_id) REFERENCES public.travel_destination(destination_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tour_destination fk_tour_destination_tour; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour_destination
    ADD CONSTRAINT fk_tour_destination_tour FOREIGN KEY (tour_id) REFERENCES public.tour(tour_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tour fk_tour_tour_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tour
    ADD CONSTRAINT fk_tour_tour_category FOREIGN KEY (tour_category_id) REFERENCES public.tour_category(tour_category_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: travel_destination fk_travel_destination_destination_category; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_destination
    ADD CONSTRAINT fk_travel_destination_destination_category FOREIGN KEY (destination_category_id) REFERENCES public.destination_category(destination_category_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: travel_post_comment fk_travel_post_comment_parent; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_comment
    ADD CONSTRAINT fk_travel_post_comment_parent FOREIGN KEY (parent_comment_id) REFERENCES public.travel_post_comment(comment_id) ON DELETE CASCADE;


--
-- Name: travel_post_comment fk_travel_post_comment_post; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_comment
    ADD CONSTRAINT fk_travel_post_comment_post FOREIGN KEY (post_id) REFERENCES public.travel_post(post_id) ON DELETE CASCADE;


--
-- Name: travel_post_comment fk_travel_post_comment_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_comment
    ADD CONSTRAINT fk_travel_post_comment_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: travel_post fk_travel_post_deleted_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post
    ADD CONSTRAINT fk_travel_post_deleted_by FOREIGN KEY (deleted_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: travel_post fk_travel_post_destination; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post
    ADD CONSTRAINT fk_travel_post_destination FOREIGN KEY (destination_id) REFERENCES public.travel_destination(destination_id) ON DELETE SET NULL;


--
-- Name: travel_post_like fk_travel_post_like_post; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_like
    ADD CONSTRAINT fk_travel_post_like_post FOREIGN KEY (post_id) REFERENCES public.travel_post(post_id) ON DELETE CASCADE;


--
-- Name: travel_post_like fk_travel_post_like_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_like
    ADD CONSTRAINT fk_travel_post_like_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: travel_post fk_travel_post_location; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post
    ADD CONSTRAINT fk_travel_post_location FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON DELETE SET NULL;


--
-- Name: travel_post_photo fk_travel_post_photo_post; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_photo
    ADD CONSTRAINT fk_travel_post_photo_post FOREIGN KEY (post_id) REFERENCES public.travel_post(post_id) ON DELETE CASCADE;


--
-- Name: travel_post_report fk_travel_post_report_post; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_report
    ADD CONSTRAINT fk_travel_post_report_post FOREIGN KEY (post_id) REFERENCES public.travel_post(post_id) ON DELETE CASCADE;


--
-- Name: travel_post_report fk_travel_post_report_reviewed_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_report
    ADD CONSTRAINT fk_travel_post_report_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: travel_post_report fk_travel_post_report_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_report
    ADD CONSTRAINT fk_travel_post_report_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: travel_post fk_travel_post_restored_by; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post
    ADD CONSTRAINT fk_travel_post_restored_by FOREIGN KEY (restored_by) REFERENCES public.users(user_id) ON DELETE SET NULL;


--
-- Name: travel_post_share fk_travel_post_share_post; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_share
    ADD CONSTRAINT fk_travel_post_share_post FOREIGN KEY (post_id) REFERENCES public.travel_post(post_id) ON DELETE CASCADE;


--
-- Name: travel_post_share fk_travel_post_share_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post_share
    ADD CONSTRAINT fk_travel_post_share_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: travel_post fk_travel_post_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_post
    ADD CONSTRAINT fk_travel_post_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: travel_story fk_travel_story_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_story
    ADD CONSTRAINT fk_travel_story_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: travel_story_view fk_travel_story_view_story; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_story_view
    ADD CONSTRAINT fk_travel_story_view_story FOREIGN KEY (story_id) REFERENCES public.travel_story(story_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: travel_story_view fk_travel_story_view_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.travel_story_view
    ADD CONSTRAINT fk_travel_story_view_user FOREIGN KEY (viewer_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_block fk_user_block_blocked; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT fk_user_block_blocked FOREIGN KEY (blocked_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: user_block fk_user_block_blocker; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT fk_user_block_blocker FOREIGN KEY (blocker_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: view360_hotspot fk_view360_hotspot_target_view360; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_hotspot
    ADD CONSTRAINT fk_view360_hotspot_target_view360 FOREIGN KEY (target_view360_id) REFERENCES public.view360(view_id) ON DELETE SET NULL;


--
-- Name: view360_hotspot fk_view360_hotspot_view360; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_hotspot
    ADD CONSTRAINT fk_view360_hotspot_view360 FOREIGN KEY (view360_id) REFERENCES public.view360(view_id) ON DELETE CASCADE;


--
-- Name: view360_image fk_view360_image_view360; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360_image
    ADD CONSTRAINT fk_view360_image_view360 FOREIGN KEY (view_id) REFERENCES public.view360(view_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: view360 fk_view360_location; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.view360
    ADD CONSTRAINT fk_view360_location FOREIGN KEY (location_id) REFERENCES public.location(location_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: password_reset_codes password_reset_codes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_codes
    ADD CONSTRAINT password_reset_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: saved_destination saved_destination_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_destination
    ADD CONSTRAINT saved_destination_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.travel_destination(destination_id) ON DELETE CASCADE;


--
-- Name: saved_destination saved_destination_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_destination
    ADD CONSTRAINT saved_destination_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: saved_tour saved_tour_tour_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_tour
    ADD CONSTRAINT saved_tour_tour_id_fkey FOREIGN KEY (tour_id) REFERENCES public.tour(tour_id) ON DELETE CASCADE;


--
-- Name: saved_tour saved_tour_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.saved_tour
    ADD CONSTRAINT saved_tour_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- Name: sepay_webhook_log sepay_webhook_log_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sepay_webhook_log
    ADD CONSTRAINT sepay_webhook_log_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payment(payment_id) ON DELETE SET NULL;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


--
-- PostgreSQL database dump complete
--

\unrestrict 5Uh5Kl7teE30W60XtmhcDgi1SOMHt7Mn5nfiwrVch5Wia5LD8RviQD1PQE0GJ6y

